import Async from 'hyper-async';
const { fromPromise, Rejected, Resolved } = Async;
import { isValidQty, roundDown } from '../../util.js';

/**
 * @description Creates a transfer that can be claimed.
 *
 * @author @jshaw-ar
 * @export
 * @param {*} state
 * @param {*} action
 * @return {*} {state}
 */
export function sell(state, action) {
  return Async.of({ state, action })
    .chain(validate)
    .fork(
      (msg) => {
        throw new ContractError(msg || 'An error occurred.');
      },
      () => ({ state })
    );
}

const validate = ({ state, action }) => {
  return Resolved({ state, action });
};
