import { fromNullable, of } from '../hyper-either.js';
import { roundDown } from '../util.js';

/**
 * @description Transfers U tokens to another address.
 *
 * @author @jshaw-ar
 * @export
 * @param {*} state
 * @param {*} action
 * @return {*} state
 */
export function transfer(state, action) {
  return of({ state, action })
    .chain(fromNullable)
    .chain(validateTransfer)
    .map(updateBalances)
    .fold(
      (error) => {
        throw new ContractError(
          error?.message || error || 'An error occurred.'
        );
      },
      () => ({ state })
    );
}

/**
 * Updates target and caller balances
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 */
const updateBalances = ({ state, action }) => {
  const safeQty = roundDown(action.input.qty);
  state.balances[action.caller] -= safeQty;
  const targetBalance = state.balances[action.input.target] || 0;
  state.balances[action.input.target] = targetBalance + safeQty;
};
