import { of, Left, Right } from '../hyper-either.js';
import { getPriceAndFee, isValidQty, roundDown } from '../util.js';

export function getPrice({ contract }) {
  return (state, action) =>
    of({ state, action })
      .chain(validate)
      .map(getPriceAndFee)
      .fold(
        (error) => {
          throw new ContractError(
            error?.message || error || 'An error occurred.'
          );
        },
        ({ price, fee }) => ({
          result: {
            qty: roundDown(action?.input?.qty),
            price,
            fee,
            owner: { addr: contract.owner, position: state.position },
            position: action?.input?.position,
            factMarket: contract.id,
          },
        })
      );
}

/**
 * Validate the input
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 * @return {*}
 */
const validate = ({ state, action }) => {
  if (!['support', 'oppose'].includes(action?.input?.position)) {
    return Left('Position must be support or oppose.');
  }
  if (!isValidQty(action?.input?.qty))
    return Left('qty must be an integer greater than zero.');

  return Right({ state, action });
};
