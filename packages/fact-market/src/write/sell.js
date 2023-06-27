import Async from 'hyper-async';
const { fromPromise } = Async;
import { of as syncOf, fromNullable } from '../hyper-either.js';
import {
  POSITION_TYPES,
  calculatePrice,
  ce,
  getBalances,
  getCurrentSupply,
  roundUp,
  roundDown,
  isInteger,
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
      .map(validate)
      .map(calcualateSellAmount)
      .chain((amount) =>
        fromPromise(contracts.write)(state.pair, {
          function: 'transfer',
          target: action.caller,
          qty: amount,
        })
      )
      .map(({ type }) => subtractBalance({ state, action, type }))
      .fork(
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
  return syncOf({ state, action })
    .chain(fromNullable)
    .chain(
      ce(
        !POSITION_TYPES.includes(action?.input?.position),
        'position must be support or oppose.'
      )
    )
    .chain(
      ce(
        !isInteger(roundDown(action?.input?.qty)),
        'qty must be an integer greater than zero.'
      )
    )
    .chain(
      ce(
        roundDown(action?.input?.qty) < 1,
        'qty must be an integer greater than zero.'
      )
    )
    .fold(
      (msg) => {
        throw new ContractError(msg || 'An error occurred.');
      },
      () => ({ state, action })
    );
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
  return syncOf(balances)
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
 * Calculates the price of the sell integral.
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
 * @param {*} { state, action, type }
 */
const subtractBalance = ({ state, action, type }) => {
  if (action.input.position === 'support') {
    state.balances[action.caller] =
      state.balances[action.caller] - action.input.qty;
  } else {
    state.oppositionBalances[action.caller] =
      state.oppositionBalances[action.caller] - action.input.qty;
  }
};
