import { of as syncOf, fromNullable } from '../hyper-either.js';
import {
  POSITION_TYPES,
  ce,
  roundDown,
  isInteger,
  getPriceAndFee,
} from '../util.js';

/**
 * @description Purchases support or opppose tokens with the pair.
 *
 * @author @jshaw-ar
 * @export
 * @param {*} { write, transaction }
 * @return {*}
 */
export function buy({ contract }) {
  /**
   * This function should only be called by the FACTS contract as action.caller
   */
  return (state, action) =>
    syncOf({ state, action, contract })
      .map(validate)
      .map(validatePriceAndFee)
      .map(({ type, price, fee }) =>
        addBalance({ type, price, fee, state, action })
      )
      .fold(
        (msg) => {
          throw new ContractError(msg || 'An error occurred.');
        },
        () => ({ state })
      );
}

/**
 * Validates the input.
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 */
const validate = ({ state, action, contract }) =>
  syncOf({ state, action })
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
    .chain(
      ce(
        state.position !== action?.input?.owner?.position,
        `owner position must be ${state.position}.`
      )
    )
    .chain(
      ce(
        contract.owner !== action?.input?.owner?.addr,
        `owner addr must be ${contract.owner}.`
      )
    )
    .fold(
      (msg) => {
        throw new ContractError(msg || 'An error occurred.');
      },
      (output) => output
    );

/**
 * Calculates and returns the price and fee.
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 * @return {*}
 */
const validatePriceAndFee = ({ state, action }) => {
  return syncOf({ state, action })
    .map(getPriceAndFee)
    .chain(({ price, fee }) =>
      ce(price !== action.input.price, 'Incorrect price.')({ price, fee })
    )
    .chain(({ price, fee }) =>
      ce(fee !== action.input.fee, 'Incorrect fee.')({ price, fee })
    )
    .fold(
      (msg) => {
        throw new ContractError(msg || 'An error occurred.');
      },
      (input) => input
    );
};

/**
 * Adds the support or opposition balance of the caller
 *
 * @author @jshaw-ar
 * @param {*} { price, fee, state, action, write, type, transaction }
 * @return {*} { price, fee, state, action, write, type, transaction }
 */
const addBalance = ({ type, price, fee, state, action }) => {
  if (action.input.position === 'support') {
    state.balances[action.caller] = roundDown(
      (state.balances[action.caller] || 0) + action.input.qty
    );
  } else {
    state.oppositionBalances[action.caller] = roundDown(
      (state.oppositionBalances[action.caller] || 0) + action.input.qty
    );
  }
  return { type, price, fee };
};
