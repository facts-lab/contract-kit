import Async, { Rejected, Resolved } from 'hyper-async';
const { fromPromise } = Async;
import { of as syncOf, fromNullable } from '../hyper-either.js';
import { ce } from '../util.js';

export function creatorClaim({ contracts }) {
  return (state, action) =>
    Async.of({ state, action })
      .map(validate)
      .chain(({ state }) =>
        fromPromise(contracts.write)(state.pair, {
          function: 'transfer',
          target: state.creator,
          qty: state.creator_cut,
        })
      )
      .chain(checkRes)
      .fork(
        (msg) => {
          throw new ContractError(msg || 'An error occurred.');
        },
        () => {
          state.creator_cut = 0;
          return { state };
        }
      );
}

const validate = ({ state, action }) => {
  return syncOf({ state, action })
    .chain(fromNullable)
    .chain(
      ce(
        state.creator !== action.caller,
        'Only the creator can call this function.'
      )
    )
    .chain(ce(state.creator_cut < 1, 'Caller does not have anything to claim.'))
    .fold(
      (msg) => {
        throw new ContractError(msg || 'An error occured');
      },
      (output) => output
    );
};

/**
 * Check that the response is
 *
 * @author @jshaw-ar
 * @param {*} { type }
 */
const checkRes = ({ type }) =>
  type === 'ok'
    ? Resolved(type)
    : Rejected(
        'There was an error calling the function on the state.pair contract.'
      );
