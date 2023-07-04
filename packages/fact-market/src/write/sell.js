import Async from 'hyper-async';
const { fromPromise, Rejected, Resolved } = Async;
import { of } from '../hyper-either.js';

import {
  POSITION_TYPES,
  calculatePrice,
  getBalances,
  getCurrentSupply,
  roundUp,
  roundDown,
  isValidQty,
} from '../util.js';

/**
 * @description Sells support or opppose tokens with the pair.
 *
 * @author @jshaw-ar
 * @export
 * @param {*} { contracts }
 * @return {*}
 */
export function sell({ contracts }) {
  return async (state, action) => {
    return Async.of({ state, action })
      .chain(validate)
      .chain(calcualateSellAmount)
      .chain((amount) =>
        fromPromise(transferU)({ state, action, amount, contracts })
      )
      .map(() => subtractBalance({ state, action }))
      .fork(
        (err) => {
          throw new ContractError(err?.message || err || 'An error occurred.');
        },
        () => ({ state })
      );
  };
}

/**
 * Validates the input
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 * @return {*} { state, action }
 */
const validate = ({ state, action }) => {
  if (!POSITION_TYPES.includes(action?.input?.position))
    return Rejected('position must be support or oppose.');
  if (!isValidQty(action?.input?.qty))
    return Rejected('qty must be an integer greater than zero.');
  return Resolved({ state, action });
};

/**
 * Gets the amou
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 * @return {*}
 */
const calcualateSellAmount = ({ state, action }) => {
  const balances = getBalances({ state, action });
  // Make the "expected" amount an optional param
  return of({ caller: action.caller, balances, qty: action?.input?.qty })
    .chain(validateBalance)
    .map(getCurrentSupply)
    .map((supply) => calculateSell(supply, action?.input?.qty))
    .chain((amount) => validateExpected(amount, action?.input?.expected));
};

/**
 * Self explanatory
 *
 * @author @jshaw-ar
 * @param {*} { balances, qty }
 * @return {*}
 */
const validateBalance = ({ caller, balances, qty }) => {
  const invalid = (balances[caller] || 0) < roundDown(qty);
  if (invalid) return Rejected('Caller balance too low.');
  return Resolved(balances);
};

/**
 * Self explanatory
 *
 * @author @jshaw-ar
 * @param {*} amount
 * @param {*} expected
 * @return {*}
 */
const validateExpected = (amount, expected) => {
  const invalid = expected && expected !== amount;
  if (invalid) return Rejected('Caller expected a different amount.');
  return Resolved(amount);
};

/**
 * Calculates the price of the sell.
 *
 * @author @jshaw-ar
 * @param {*} supply
 * @param {*} qty
 */
const calculateSell = (supply, qty) => {
  const safeQty = roundDown(qty);
  const price = calculatePrice(1, 1, supply, supply - safeQty) * -1;
  return roundUp(price);
};

/**
 * Subtracts the support or opposition balance of the caller.
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 */
const subtractBalance = ({ state, action }) => {
  if (action.input.position === 'support') {
    state.balances[action.caller] =
      state.balances[action.caller] - roundDown(action.input.qty);
  } else {
    state.oppose[action.caller] =
      state.oppose[action.caller] - roundDown(action.input.qty);
  }
};

/**
 * Transfers U
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 * @return {*}
 */
async function transferU({ state, action, amount, contracts }) {
  const result = await contracts.write(state.pair, {
    function: 'transfer',
    target: action.caller,
    qty: amount,
  });

  // This only exists if the tx is successful
  if (result.type !== 'ok') {
    throw new ContractError('There was an error transferring U.');
  }
}
