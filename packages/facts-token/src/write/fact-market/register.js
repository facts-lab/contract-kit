import Async from 'hyper-async';
const { fromPromise, Rejected, Resolved } = Async;
import { isValidQty, roundDown } from '../../util.js';

/**
 * @description Buys Position Tokens on a Fact Market.
 *
 * @author @jshaw-ar
 * @export
 * @param {*} state
 * @param {*} action
 * @return {*} {state}
 */
export function register({ contracts }) {
  return async (state, action) => {
    return Async.of({ state, action })
      .chain(validateInput)
      .chain(fromPromise(contracts.readContractState))
      .chain((u_state) =>
        validateTransfer({
          state,
          action,
          claimable: u_state.claimable,
        })
      )
      .fork(
        (err) => {
          console.log('Error registering!');
          throw new ContractError(err?.message || err || 'An error occurred.');
        },
        (from) => {
          state.positions.push({ ...action?.input?.position, from });
          return { state };
        }
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
  if (!action?.input?.position?.tx) return Rejected('tx is required.');

  if (!isValidQty(action?.input?.position?.qty))
    return Rejected('qty must be an integer greater than zero.');
  if (!isValidQty(action?.input?.position?.price))
    return Rejected('price must be an integer greater than 0.');
  if (!isValidQty(action?.input?.position?.fee))
    return Rejected('fee must be an integer greater than 0.');

  if (!action?.input?.position?.position)
    return Rejected('position is required.');

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
  const qty = action?.input?.position?.price + action?.input?.position?.fee;
  const tx = action?.input?.position?.tx;
  const claim = claimable?.filter((c) => c.txID === tx)[0];
  if (qty !== claim?.qty) return Rejected({ state, action });
  if (tx !== claim.txID) return Rejected({ state, action });
  if (action.caller !== claim.to) return Rejected({ state, action });
  console.log('Resolving!');
  return Resolved(claim.from);
}

/**
 * Claims a U transfer
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 * @return {*}
 */
async function claimU({ state, action, contracts }) {
  const result = await contracts.write(state.u, {
    function: 'claim',
    txID: action?.input?.tx,
    qty: action?.input?.price + action?.input?.fee,
  });

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
async function rejectU({ state, action, contracts }) {
  const result = await contracts.write(state.u, {
    function: 'reject',
    tx: action?.input?.tx,
  });
  if (result.type !== 'ok') {
    throw new ContractError('There was an error rejecting U.');
  }
  return 'rejected';
}

/**
 * Purchase the fact market if the tokens where claimed.
 *
 * @author @jshaw-ar
 * @param {*} { action, previous, contracts }
 * @return {*}
 */
async function buyFactMarket({ action, previous, contracts }) {
  if (previous === 'claimed') {
    const result = await contracts.write(action?.input?.factMarket, {
      ...action.input,
    });

    if (result.type !== 'ok') {
      throw new ContractError(
        'There was an error purchasing your Position tokens.'
      );
    }
    return previous;
  }
  return previous;
}

/**
 * Distribute fee to either the contract or the author based
 * on whether or not the caller agrees with the author.
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 * @return {*}
 */
function distributeFee({ state, action, previous }) {
  /**
   * If the caller is the owner of the fact market, burn the fee
   * Prevents owners from buying their own tokens for $FACTS rewards
   * and also receiving the fee from their own purchases.  Just burn $FACTS
   * instead.
   */
  if (action.caller === action.input.owner.addr) {
    return cutBurn({ state, action });
  }
  /**
   * Only distribute if the $U tokens were claimed.
   */
  if (previous === 'claimed') {
    const agrees = action.input.owner.position === action.input.position;
    switch (agrees) {
      case true:
        return cutCreator({ state, action });
      case false:
        return cutBurn({ state, action });
    }
  }
}

/**
 * Send fee to creator.
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 * @return {*} { state, action }
 */
function cutCreator({ state, action }) {
  const balance = state.creators[action.input.owner.addr] || 0;
  state.creators[action.input.owner.addr] = roundDown(
    balance + action.input.fee
  );
  return { state, action };
}

/**
 * Send fee to burn
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 * @return {*} { state, action }
 */
function cutBurn({ state, action }) {
  state.fees = roundDown(state.fees || 0 + action.input.fee);
  return { state, action };
}
