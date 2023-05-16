import {
  allowBalance,
  calculatePrice,
  getCurrentSupply,
  distribute,
} from '../util.js';

/**
 * @description Sells support or opppose tokens with the pair.
 *
 * @author @jshaw-ar
 * @export
 * @param {*} { write, transaction }
 * @return {*}
 */
export function sell({ write, transaction }) {
  return async (state, action) => {
    return of({ state, action })
      .chain(
        ceAsync(
          !POSITION_TYPES.includes(action?.input?.positionType),
          'positionType must be support or oppose.'
        )
      )
      .chain(
        ceAsync(
          !isInteger(roundDown(action?.input?.qty)),
          'qty must be an integer greater than zero.'
        )
      )
      .chain(
        ceAsync(
          roundDown(action?.input?.qty) < 1,
          'qty must be an integer greater than zero.'
        )
      )
      .fork(
        (msg) => {
          throw new ContractError(msg || 'An error occurred.');
        },
        () => {
          console.log('done');
          return { state };
        }
      );
  };
}
// export async function sell(state, action) {
//   const caller = action.caller;
//   const { positionType, expected } = action.input;
//   const type = positionType;
//   if (type !== 'oppose' && type !== 'support') {
//     throw new ContractError(
//       `Please specify a type. (eg. "support" or "oppose") -- positionType: ${type}`
//     );
//   }

//   let balances;
//   if (type === 'oppose') {
//     balances = state.oppositionBalances;
//   }
//   if (type === 'support') {
//     balances = state.balances;
//   }
//   if (!balances) {
//     throw new ContractError(
//       `Something went wrong when calculating balances: ${action.input}`
//     );
//   }

//   if (!Number.isInteger(balances[caller]))
//     throw new ContractError(`You don't own any tokens.`);

//   const qty = action.input.qty || balances[caller];

//   const supply = getCurrentSupply(balances);
//   if (qty > balances[caller])
//     throw new ContractError(`You only have ${balances[caller]} tokens.`);
//   if (supply - qty > supply) throw new ContractError(`Something went wrong.`);
//   const returns = Math.floor(calculatePrice(1, 1, supply, supply - qty)) * -1;
//   if (returns !== expected)
//     throw new ContractError(
//       `Supply changed before you calculated your expected returns.`
//     );

//   if (returns < 0)
//     throw new ContractError(`Returns less than zero: ${returns}.`);

//   await allowBalance(state.pair, caller, returns);
//   if (type === 'oppose') {
//     if (balances) state.oppositionBalances[caller] -= qty;
//   }
//   if (type === 'support') {
//     if (balances) state.balances[caller] -= qty;
//   }
//   const result = await distribute(state.creator, state.creator_cut, state.pair);
//   if (result.type !== 'ok') state.creator_cut = 0;
//   return { state };
// }
