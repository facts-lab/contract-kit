import { Left, Right, fromNullable, of } from '../hyper-either.js';

/**
 * Rejects a claim, and sends tokens back to the from value of the claim.
 *
 * @author @jshaw-ar
 * @export
 * @param {*} state
 * @param {*} action
 * @return {*}
 */
export function rejectClaimable(state, action) {
  return of({ state, action })
    .chain(fromNullable)
    .chain(validate)
    .map(addClaimBalanceFrom)
    .map((indexToRemove) => {
      state.claimable.splice(indexToRemove, 1);
      return state;
    })
    .fold(
      (msg) => {
        throw new ContractError(msg || 'An error occurred.');
      },
      (state) => ({ state })
    );
}

/**
 * Validates the reject input
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 * @return {*}
 */
const validate = ({ state, action }) => {
  if (!action.input?.tx)
    return Left('tx must be passed to the reject function.');
  if (state.claimable.filter((c) => c.txID === action.input.tx).length !== 1)
    return Left('There must be 1 claimable with this tx id.');
  if (
    state.claimable.filter((c) => c.txID === action.input.tx)[0]?.to !==
    action.caller
  )
    return Left('Claim not addressed to caller.');
  return Right({ state, action });
};

/**
 * @description Adds the qty to the 'from' balance
 *
 * @author @jshaw-ar
 * @param {*} state
 * @param {*} action
 * @return {number} indexToRemove
 */
export const addClaimBalanceFrom = ({ state, action }) => {
  const indexToRemove = state.claimable.findIndex(
    (claim) => claim.txID === action.input.tx
  );
  const claim = state.claimable[indexToRemove];
  const balance = state.balances[claim.from] || 0;
  state.balances[claim.from] = balance + claim.qty;
  return indexToRemove;
};
