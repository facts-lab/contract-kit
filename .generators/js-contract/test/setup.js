import { readState } from "@facts-kit/contract-kit";
export function setupSmartWeaveEnv(reward, height) {
  globalThis.SmartWeave = {
    transaction: {
      reward: reward || 1,
    },
    block: {
      height: height || 1,
    },
    contracts: {
      readContractState: async (tx) => {
        return await readState(tx);
      },
    },
  };
  globalThis.ContractError = ContractError;
}

class ContractError {
  constructor(error) {
    throw new Error(error);
  }
}
