import { buy } from './write/buy';

export async function handle(state, action) {
  const env = {
    contracts: SmartWeave.contracts,
    block: SmartWeave.block,
    transaction: SmartWeave.transaction,
  };

  switch (action.input.function) {
    case 'buy':
      return buy(env)(state, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognized`
      );
  }
}
