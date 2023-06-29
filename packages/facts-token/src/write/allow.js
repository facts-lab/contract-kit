import { fromNullable, of } from '../hyper-either.js';
import { roundDown, validateTransfer } from '../util.js';

/**
 * @description Creates a transfer that can be claimed.
 *
 * @author @jshaw-ar
 * @export
 * @param {*} state
 * @param {*} action
 * @return {*} {state}
 */
export function allow({ transaction }) {
  return (state, action) => {
    return of({ state, action, transaction })
      .chain(fromNullable)
      .chain(validateTransfer)
      .map(createClaimableTransfer)
      .fold(
        (msg) => {
          throw new ContractError(msg || 'An error occurred.');
        },
        () => ({ state })
      );
  };
}

/**
 * Creates a transfer that can be claimed.
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 */
const createClaimableTransfer = ({ state, action }) => {
  const safeQty = roundDown(action.input.qty);
  state.balances[action.caller] -= safeQty;
  state.claimable.push({
    from: action.caller,
    to: action.input.target,
    qty: safeQty,
    txID: transaction.id,
  });
};
