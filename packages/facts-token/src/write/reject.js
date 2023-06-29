import { Left, Right, fromNullable, of } from '../hyper-either.js';

import { addClaimBalanceFrom } from '../util.js';

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
