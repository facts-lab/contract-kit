import { of, fromNullable, Left, Right } from '../hyper-either.js';
import {
  POSITION_TYPES,
  roundDown,
  getPriceAndFee,
  isValidQty,
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
  return (state, action) => {
    return of({ state, action, contract })
      .chain(fromNullable)
      .chain(validate)
      .chain(validatePriceAndFee)
      .map(({ price, fee }) => addBalance({ price, fee, state, action }))
      .fold(
        (error) => {
          throw new ContractError(
            error?.message || error || 'An error occurred.'
          );
        },
        () => ({ state })
      );
  };
}

/**
 * Validates the input.
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 */
const validate = ({ state, action, contract }) => {
  if (!POSITION_TYPES.includes(action?.input?.position))
    return Left('position must be support or oppose.');
  if (!isValidQty(action?.input?.qty))
    return Left('qty must be an integer greater than zero.');
  if (state.position !== action?.input?.owner?.position)
    return Left(`owner position must be ${state.position}.`);
  if (contract.owner !== action?.input?.owner?.addr)
    return Left(`owner addr must be ${contract.owner}.`);
  return Right({ state, action });
};

/**
 * Calculates and returns the price and fee.
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 * @return {*}
 */
const validatePriceAndFee = ({ state, action }) => {
  const { price, fee } = getPriceAndFee({ state, action });
  if (price !== action.input.price) return Left('Incorrect price.');
  if (fee !== action.input.fee) return Left('Incorrect fee.');
  return Right({ price, fee });
};

/**
 * Add to the callers support or oppose balance
 *
 * @author @jshaw-ar
 * @param {*} { price, fee, state, action }
 * @return {*}
 */
const addBalance = ({ price, fee, state, action }) => {
  if (action.input.position === 'support') {
    state.balances[action.caller] = roundDown(
      (state.balances[action.caller] || 0) + action.input.qty
    );
  } else {
    state.oppose[action.caller] = roundDown(
      (state.oppose[action.caller] || 0) + action.input.qty
    );
  }
  return { price, fee };
};
