import { balance } from './read/balance.js';
import { getPrice } from './read/get-price.js';
import { getSupply } from './read/get-supply.js';
import { buy } from './write/buy.js';
import { sell } from './write/sell.js';

export async function handle(state, action) {
  const fn = action?.input?.function;
  // if (fn === 'buy' && action.input.caller !== '<FACTS_CONTRACT_ID>') {
  //   throw new ContractError('Only the FACTS contract can call this function.');
  // }
  // Only allow L2 transactions
  // if (SmartWeave.transaction.origin !== 'L2') {
  //   return { state };
  // }

  const env = {
    contract: SmartWeave.contract,
    contracts: SmartWeave.contracts,
    transaction: SmartWeave.transaction,
  };

  switch (fn) {
    // Read
    case 'get-price':
      return getPrice(env)(state, action);
    case 'get-supply':
      return getSupply(state);
    case 'balance':
      return balance(state, action);
    // Write
    case 'buy':
      return buy(env)(state, action);
    case 'sell':
      return sell(env)(state, action);

    default:
      throw new ContractError(
        `No function supplied or function not recognized`
      );
  }
}
