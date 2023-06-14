import Async from 'hyper-async';
const { fromPromise } = Async;
import { of as syncOf, fromNullable } from '../hyper-either.js';
import { ce, isInteger, roundDown } from '../util.js';

export function register(env) {
  return async (state, action) => {
    return Async.of({ state, action })
      .map(validate)
      .map((input) => {
        console.log('input', input);
        return input;
      })
      .chain(fromPromise(distribute))
      .fork(
        (e) => {
          console.log('LEFT', e);
          throw new ContractError(e?.message || e || 'An error occurred');
        },
        () => {
          console.log('Done!');
        }
      );
  };
}

const validate = ({ state, action }) => {
  return syncOf({ state, action })
    .chain(fromNullable)
    .chain(
      ce(!isInteger(roundDown(action?.input?.qty)), 'qty must be an integer.')
    )
    .chain(
      ce(
        roundDown(action?.input?.qty) < 1,
        'qty must be an integer greater than zero.'
      )
    )
    .chain(ce(action?.input?.addr?.length !== 43, 'addr must be 43 chars.'))
    .chain(ce(action?.input?.tx?.length !== 43, 'tx must be 43 chars.'))
    .chain(
      ce(action?.input?.contract?.length !== 43, 'contract must be 43 chars.')
    )
    .chain(
      ce(action?.input?.allowTx?.length !== 43, 'allowTx must be 43 chars.')
    )
    .fold(
      (e) => {
        throw new ContractError(e?.message || e || 'An error occurred');
      },
      (output) => {
        console.log('OUTPUT', output);
        return output;
      }
    );
};

const checkClaimable = async ({ state, action, contracts }) => {
  // const {qty, addr, tx}
};

// check that each position is vouched
// check that the interaction is coming from a fact market (deployed from source?)
const distribute = async ({ state, action }) => {
  console.log('Distribute', state, action);
  return { state, action };
};
