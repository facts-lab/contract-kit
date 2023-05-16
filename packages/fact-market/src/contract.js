import { buy } from './write/buy';

export async function handle(state, action) {
  const env = {
    readContractState: SmartWeave.contracts.readContractState.bind(SmartWeave),
    viewContractState: SmartWeave.contracts.viewContractState.bind(SmartWeave),
    write: SmartWeave.contracts.write.bind(SmartWeave),
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
