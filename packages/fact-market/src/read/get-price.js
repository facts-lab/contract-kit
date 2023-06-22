import { fromNullable, of } from '../hyper-either.js';
import { ce, getPriceAndFee, isInteger, roundDown } from '../util.js';

export function getPrice({ transaction }) {
  return (state, action) =>
    of({ state, action })
      .chain(
        ce(
          !['support', 'oppose'].includes(action?.input?.position),
          'Position must be support or oppose.'
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
            owner: { addr: transaction.owner, position: state.position },
            position: action?.input?.position,
          },
        })
      );
}
