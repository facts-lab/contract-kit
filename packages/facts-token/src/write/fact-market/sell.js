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

/**
 * Input:
 * - position
 * - qty
 * - expected (optional)
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
  if (!POSITION_TYPES.includes(action?.input?.position))
    return Rejected('position must be support or oppose.');
  if (!isValidQty(action?.input?.qty))
    return Rejected('qty must be an integer greater than zero.');
  return Resolved({ state, action });
};
