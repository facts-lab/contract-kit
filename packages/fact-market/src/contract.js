import { balance } from './read/balance.js';
import { transfer } from './write/transfer.js';
import { claim } from './write/claim.js';
import { allow } from './write/allow.js';
import { rejectClaimable } from './write/reject.js';

export async function handle(state, action) {
  // Only allow L2 transactions
  if (SmartWeave.transaction.origin !== 'L2') {
    return { state };
  }

  switch (action?.input?.function) {
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
