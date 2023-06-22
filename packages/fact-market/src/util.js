import BigNumber from 'bignumber.js';
import { Left, Right, of as syncOf } from './hyper-either.js';
import { Rejected, Resolved } from 'hyper-async';

export const POSITION_TYPES = ['support', 'oppose'];

/**
 * @description Contract Error (use with hyper-either)
 *
 * @author @jshaw-ar
 * @param {Boolean} flag What your conditional check is
 * @param {string} message Error message if conditional is true
 * @param {{state, action}} p The payload to pass through the func
 * @return {{state, action}} p
 */
export const ce = (flag, message) => (p) => flag ? Left(message) : Right(p);

/**
 * @description Contract Error Async (use with hyper-async)
 *
 * @author @jshaw-ar
 * @param {Boolean} flag What your conditional check is
 * @param {string} message Error message if conditional is true
 * @param {{state, action}} p The payload to pass through the func
 * @return {{state, action}} p
 */
export const ceAsync = (flag, message) => (p) =>
  flag ? Rejected(message) : Resolved(p);

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
 * @description Uses bignumber.js to round up.
 *
 * @author @jshaw-ar
 * @export
 * @param {number} v
 * @return {number}
 */
export function roundUp(v) {
  return new BigNumber(v).integerValue(BigNumber.ROUND_CEIL).toNumber();
}

/**
 *
 *
 * @export
 * @param {number} m slope
 * @param {number} C constant (should be 1)
 * @param {number} x1 first point on the x-axis
 * @param {number} x2 second point on the x-axis
 * @return {*}
 */
export function calculatePrice(m, C, x1, x2) {
  // The antidirivitive of f(x) = m * x;
  const F = (x) => (m * (x * x)) / 2 + C;

  // Return the difference between the values of the antiderivative at x1 and x2
  // This calculates the "Area under the curve"
  // Calculates the "Definite Integral"
  return F(x2) - F(x1);
}

export function getCurrentSupply(balances) {
  if (Object.values(balances).length === 0) return 0;
  return Object.values(balances).reduce((a, b) => a + b);
}

/**
 * @description returns the correct balances to operate on.
 *
 * @author @jshaw-ar
 * @export
 * @param {*} {state, action}
 * @return {object} balances
 */
export const getBalances = ({ state, action }) =>
  action.input.position === 'support'
    ? state.balances
    : state.oppositionBalances;

/**
 * Calculates and returns the price and fee.
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 * @return {*}
 */
export const getPriceAndFee = ({ state, action }) => {
  return syncOf({ state, action })
    .map(getBalances)
    .map(getCurrentSupply)
    .map((supply) =>
      roundUp(
        calculatePrice(1, 1, supply, supply + roundDown(action.input.qty))
      )
    )
    .map(getFee)
    .fold(
      (error) => {
        throw new ContractError(
          error?.message || error || 'An error occurred.'
        );
      },
      (output) => output
    );
};

/**
 * Calculates fee
 *
 * @author @jshaw-ar
 * @param {*} price
 * @returns {Object} {fee, price}
 */
export const getFee = (price) => ({
  fee: roundUp((5 / 100) * price),
  price,
});
