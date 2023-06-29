import BigNumber from 'bignumber.js';
import { Left, Right } from './hyper-either.js';

/**
 * @description Uses BigNumber to check if value is an integer.
 *
 * @author @jshaw-ar
 * @export
 * @param {number} v
 * @return {boolean}
 */
export function isInteger(v) {
  return new BigNumber(v).isInteger();
}

/**
 * @description Uses bignumber.js to round down.
 *
 * @author @jshaw-ar
 * @export
 * @param {number} v
 * @return {number}
 */
export function roundDown(v) {
  return new BigNumber(v).integerValue(BigNumber.ROUND_DOWN).toNumber();
}

/**
 * @description Removes expired from array.
 *
 * @author @jshaw-ar
 * @export
 * @param {Array} queue
 * @param {number} height
 * @return {Array}
 */
export const removeExpired = (queue, height) =>
  queue.filter((request) => request?.expires > height);

/**
 * Validates a qty is an integer grater than 0
 *
 * @author @jshaw-ar
 * @param {number} qty
 * @return {boolean}
 */
export const isValidQty = (qty) => {
  if (!qty) return false;
  if (!isInteger(qty)) return false;
  if (qty < 1) return false;
  return true;
};

/**
 * Validates the transfer input
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 * @return {*} { state, action }
 */
export const validateTransfer = ({ state, action, transaction }) => {
  if (!action.input?.target) return Left('Please specify a target.');
  if (action.input?.target === action.caller)
    return Left('Target cannot be caller.');
  if (!isValidQty(action?.input?.qty))
    return Left('qty must be an integer greater than zero.');
  if ((state.balances[action.caller] || 0) < roundDown(action.input?.qty))
    return Left('Not enough tokens for transfer.');
  return Right({ state, action, transaction });
};
