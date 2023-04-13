import { balance } from './read/balance';
import { transfer } from './write/transfer';

export async function handle(state, action) {
  const input = action.input;

  switch (input.function) {
    case 'balance':
      return await balance(state, action);
    case 'transfer':
      return await transfer(state, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognized`
      );
  }
}
