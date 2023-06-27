import Async from 'hyper-async';
import { isValidQty } from '../util';
const { fromPromise, Rejected, Resolved } = Async;
// import { of as syncOf, fromNullable } from '../hyper-either.js';
// import {
//   POSITION_TYPES,
//   calculatePrice,
//   ce,
//   getBalances,
//   getCurrentSupply,
//   roundUp,
//   roundDown,
//   isInteger,
// } from '../util.js';
/**
 * @description Creates a transfer that can be claimed.
 *
 * @author @jshaw-ar
 * @export
 * @param {*} state
 * @param {*} action
 * @return {*} {state}
 */
export function buy({}) {
  return async (state, action) => {
    /**
     * Steps
     * - validate the input
     * - read state of U to make sure claim is valid
     * - claim the tokens
     * - try to purchase Position tokens
     * - if successful, claim and complete transaction
     *    - cut or burn
     *    - register interaction
     * - if failure, reject tokens and return state
     */
    return (
      Async.of({ state, action })
        .chain(validateInput)
        .chain(fromPromise(SmartWeave.contracts.readContractState))
        .chain((u_state) =>
          validateTransfer({ state, action, claimable: u_state.claimable })
        )
        .bichain(
          () => fromPromise(rejectU)({ state, action }),
          () => fromPromise(claimU)({ state, action })
        )
        .chain((previous) => fromPromise(buyFactMarket)({ action, previous }))
        // successfully bought fact market
        // cut or burn
        .fork(
          (error) => {
            console.log('Error', error);
            throw new ContractError(JSON.stringify(error));
          },
          () => {
            console.log('Done!');
            return { state };
          }
        )
    );
  };
}

/**
 * Validates the input of the purchase.
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 * @return {string} u contract addr
 */
function validateInput({ state, action }) {
  if (!action?.input?.tx) return Rejected('tx is required.');

  if (!isValidQty(action?.input?.qty))
    return Rejected('qty must be an integer greater than 0.');
  if (!isValidQty(action?.input?.price))
    return Rejected('price must be an integer greater than 0.');
  if (!isValidQty(action?.input?.fee))
    return Rejected('fee must be an integer greater than 0.');

  if (!action?.input?.position) return Rejected('position is required.');
  if (!action?.input?.factMarket) return Rejected('factMarket is required.');
  if (!action?.input?.owner?.addr)
    return Rejected('Please specify the owner address of the Fact Market');
  if (!action?.input?.owner?.position)
    return Rejected(
      'Please specify the position of the fact market creator. (support or oppose)'
    );
  if (!['support', 'oppose'].includes(action?.input?.owner?.position))
    return Rejected('position must be support or oppose');

  return Resolved(state.u);
}

/**
 * Check if the claim is valid
 *
 * @author @jshaw-ar
 * @param {*} { state, action, claimable }
 * @return {*}
 */
function validateTransfer({ state, action, claimable }) {
  const qty = action?.input?.price + action?.input?.fee;
  const tx = action?.input?.tx;
  const claim = claimable?.filter((c) => c.txID === tx)[0];
  if (qty !== claim?.qty) return Rejected({ state, action });
  if (tx !== claim.txID) return Rejected({ state, action });
  if (action.caller !== claim.from) return Rejected({ state, action });
  if (SmartWeave.contract.id !== claim.to) return Rejected({ state, action });
  return Resolved({ state, action });
}

/**
 * Claims a U transfer
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 * @return {*}
 */
async function claimU({ state, action }) {
  const input = {
    function: 'claim',
    txID: action?.input?.tx,
    qty: action?.input?.price + action?.input?.fee,
  };
  const result = await SmartWeave.contracts.write(state.u, input);

  // This only exists if the tx is successful
  if (result.type !== 'ok') {
    throw new ContractError('There was an error claiming U.');
  }
  return 'claimed';
}

/**
 * Rejects a U transfer
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 * @return {*}
 */
async function rejectU({ state, action }) {
  const result = await SmartWeave.contracts.write(state.u, {
    function: 'reject',
    tx: action?.input?.tx,
  });
  if (result.type !== 'ok') {
    throw new ContractError('There was an error rejecting U.');
  }
  return 'rejected';
}

async function buyFactMarket({ action, previous }) {
  if (previous === 'claimed') {
    const result = await SmartWeave.contracts.write(action?.input?.factMarket, {
      ...action.input,
    });

    if (result.type !== 'ok') {
      throw new ContractError(
        'There was an error purchasing your Position tokens.'
      );
    }
  }
}
