import { balance } from './read/balance.js';
import { buy } from './write/buy.js';
import { sell } from './write/sell.js';

export async function handle(state, action) {
  // Only allow L2 transactions
  // if (SmartWeave.transaction.origin !== 'L2') {
  //   return { state };
  // }

  const env = {
    contract: SmartWeave.contract,
    contracts: SmartWeave.contracts,
    transaction: SmartWeave.transaction,
  };

  switch (action?.input?.function) {
    case 'balance':
      return balance(state, action);
    case 'buy':
      return buy(env)(state, action);
    case 'sell':
      return sell(env)(state, action);
    case 'get-price':
      throw new ContractError('Implement me please!');
    default:
      throw new ContractError(
        `No function supplied or function not recognized`
      );
  }
}
