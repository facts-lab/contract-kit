import Async from 'hyper-async';
const { fromPromise, Rejected, Resolved } = Async;
import {
  POSITION_TYPES,
  roundDown,
  getPriceAndFee,
  isValidQty,
} from '../util.js';

/**
 * @description Purchases support or opppose tokens with the pair.
 *
 * @author @jshaw-ar
 * @export
 * @param {*} { write, transaction }
 * @return {*}
 */
export function buy({ contract, contracts }) {
  return (state, action) =>
    Async.of({ state, action, contract })
      .chain(validate)
      .chain(({ state }) =>
        fromPromise(contracts.readContractState)(state.pair)
      )
      .chain((u_state) =>
        validateTransfer({
          state,
          action,
          claimable: u_state.claimable,
          contract,
        })
      )
      .chain(validatePriceAndFee)
      .map(({ price, fee }) => addBalance({ price, fee, state, action }))
      .chain(() => fromPromise(register)({ state, action, contracts }))
      .chain(() => fromPromise(claimU)({ state, action, contracts }))
      .fork(
        (error) => {
          throw new ContractError(
            error?.message || error || 'An error occurred.'
          );
        },
        () => ({ state })
      );
}

/**
 * Validates the input.
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 */
const validate = ({ state, action }) => {
  if (!POSITION_TYPES.includes(action?.input?.position))
    return Rejected('position must be support or oppose.');
  if (!isValidQty(action?.input?.qty))
    return Rejected('qty must be an integer greater than zero.');
  return Resolved({ state, action });
};

/**
 * Check if the claim is valid
 *
 * @author @jshaw-ar
 * @param {*} { state, action, claimable }
 * @return {*}
 */
const validateTransfer = ({ state, action, claimable, contract }) => {
  const qty = action?.input?.price + action?.input?.fee;
  const tx = action?.input?.tx;
  const claim = claimable?.filter((c) => c.txID === tx)[0];
  if (qty !== claim?.qty) return Rejected('transfer qty invalid.');
  if (tx !== claim.txID) return Rejected('transfer txID invalid.');
  if (action.caller !== claim.from) return Rejected('transfer from invalid');
  if (contract.id !== claim.to) return Rejected('transfer to invalid');
  return Resolved({ state, action });
};

/**
 * Calculates and returns the price and fee.
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 * @return {*}
 */
const validatePriceAndFee = ({ state, action }) => {
  const { price, fee } = getPriceAndFee({ state, action });
  if (price !== action.input.price) return Rejected('Incorrect price.');
  if (fee !== action.input.fee) return Rejected('Incorrect fee.');
  return Resolved({ price, fee });
};

/**
 * Add to the callers support or oppose balance
 *
 * @author @jshaw-ar
 * @param {*} { price, fee, state, action }
 * @return {*}
 */
const addBalance = ({ state, action }) => {
  if (action.input.position === 'support') {
    state.creator_cut =
      (state.creator_cut || 0) + roundDown(action?.input?.fee);
    state.balances[action.caller] = roundDown(
      (state.balances[action.caller] || 0) + action.input.qty
    );
  } else {
    state.burn = (state.burn || 0) + roundDown(action?.input?.fee);
    state.oppose[action.caller] = roundDown(
      (state.oppose[action.caller] || 0) + action.input.qty
    );
  }
};

/**
 * Rejects a U transfer
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 * @return {*}
 */
async function register({ state, action, contracts }) {
  if (state.register) {
    const result = await contracts.write('<FACTS_CONTRACT_ID>', {
      function: 'register',
      position: action?.input,
    });
    if (result.type !== 'ok') {
      throw new ContractError(
        'There was an error registering with the Facts contract.'
      );
    }
  }
}

/**
 * Claims a U transfer
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 * @return {*}
 */
async function claimU({ state, action, contracts }) {
  const result = await contracts.write(state.pair, {
    function: 'claim',
    txID: action?.input?.tx,
    qty: action?.input?.price + action?.input?.fee,
  });

  // This only exists if the tx is successful
  if (result.type !== 'ok') {
    throw new ContractError('There was an error claiming U.');
  }
}
