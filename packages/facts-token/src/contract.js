import { balance } from './read/balance.js';
import { buy } from './write/fact-market/buy.js';
// import { sell } from './write/fact-market/sell.js';
import { transfer } from './write/transfer.js';
import { claim } from './write/claim.js';
import { allow } from './write/allow.js';
import { rejectClaimable } from './write/reject.js';

export async function handle(state, action) {
  // Only allow L2 transactions
  // if (SmartWeave.transaction.origin !== 'L2') {
  //   return { state };
  // }

  const env = {
    contract: SmartWeave.contract,
    contracts: SmartWeave.contracts,
  };

  switch (action?.input?.function) {
    case 'fact-market-buy':
      return buy(env)(state, action);
    // case 'fact-market-sell':
    //   return sell(env)(state, action);
    case 'balance':
      return balance(state, action);
    case 'reject':
      return rejectClaimable(state, action);
    case 'transfer':
      return transfer(state, action);
    case 'allow':
      return allow(state, action);
    case 'claim':
      return claim(state, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognized`
      );
  }
}
