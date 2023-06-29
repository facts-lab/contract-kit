import { of, fromNullable, Left, Right } from '../hyper-either.js';
import {
  POSITION_TYPES,
  calculatePrice,
  ce,
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
export function sell({}) {
  return (state, action) => {
    return of({ state, action })
      .chain(fromNullable)
      .chain(validate)
      .map(calcualateSellAmount)
      .map(({ type }) => subtractBalance({ state, action, type }))
      .fold(
        (msg) => {
          throw new ContractError(msg || 'An error occurred.');
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
    return Left('position must be support or oppose.');
  if (!isValidQty(action?.input?.qty))
    return Left('qty must be an integer greater than zero.');
  return Right({ state, action });
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
  return of(balances)
    .chain((balances) =>
      ce(
        (balances[action?.caller] || 0) < roundDown(action?.input?.qty),
        'Caller balance too low.'
      )(balances)
    )
    .map(getCurrentSupply)
    .map((supply) => calculateSell(supply, action?.input?.qty))
    .chain((amount) =>
      ce(action?.input?.expected !== amount, 'The price has changed.')(amount)
    )
    .fold(
      (msg) => {
        throw new ContractError(msg || 'An error occurred.');
      },
      (amount) => amount
    );
};

/**
 * Calculates the price of the sell.
 *
 * @author @jshaw-ar
 * @param {*} supply
 * @param {*} qty
 */
const calculateSell = (supply, qty) =>
  roundUp(calculatePrice(1, 1, supply, supply - roundDown(qty))) * -1;

/**
 * Subtracts the support or opposition balance of the caller.
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 */
const subtractBalance = ({ state, action }) => {
  if (action.input.position === 'support') {
    state.balances[action.caller] =
      state.balances[action.caller] - action.input.qty;
  } else {
    state.oppose[action.caller] =
      state.oppose[action.caller] - action.input.qty;
  }
};
