import { Left, Right, fromNullable, of } from '../hyper-either.js';

/**
 * @description Claims U from claimables
 *
 * @author @jshaw-ar
 * @export
 * @param {*} state
 * @param {*} action
 * @return {*} {state}
 */
export function claim(state, action) {
  return of({ state, action })
    .chain(fromNullable)
    .chain(validate)
    .map(addClaimBalanceTo)
    .map((indexToRemove) => {
      state.claimable.splice(indexToRemove, 1);
      return state;
    })
    .fold(
      (error) => {
        throw new ContractError(
          error?.messsage || error || 'An error occurred.'
        );
      },
      () => {
        return { state };
      }
    );
}

const validate = ({ state, action }) => {
  if (!action.input?.txID)
    return Left('txID must be passed to the claim function.');
  if (!action.input?.qty) return Left('qty is required.');
  if (state.claimable.filter((c) => c.txID === action.input.txID).length !== 1)
    return Left('There must be 1 claimable with this tx id.');
  if (
    state.claimable.filter((c) => c.txID === action.input?.txID)[0]?.to !==
    action.caller
  )
    return Left('Claim not addressed to caller.');
  if (
    state.claimable.filter((c) => c.txID === action.input.txID)[0]?.qty !==
    action.input?.qty
  )
    return Left('Incorrect qty.');
  return Right({ state, action });
};

/**
 * @description Adds the qty to the 'to' balance
 *
 * @author @jshaw-ar
 * @param {*} state
 * @param {*} action
 * @return {number}
 */
export const addClaimBalanceTo = ({ state, action }) => {
  const indexToRemove = state.claimable.findIndex(
    (claim) => claim.txID === action.input.txID
  );
  const claim = state.claimable[indexToRemove];
  const balance = state.balances[claim.to] || 0;
  state.balances[claim.to] = balance + claim.qty;
  return indexToRemove;
};
