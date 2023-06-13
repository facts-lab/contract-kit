import { toPairs } from 'ramda';

export function setupSmartWeaveEnv({
  reward,
  height,
  id,
  readContractState, // pass `Promise.reject("<READ-ERROR>")` for error
  write, // pass `Promise.reject("<WRITE-ERROR>")` for error
  viewContractState,
  balances, // Pass balances like {"<addr>": "<qty>"} and a proxy map will be built to mock SmartWeave.KV
}) {
  const pairs = toPairs(balances);
  const map = new Map(pairs);
  const rejected = [];
  const registered = [];
  const claimed = [];
  const allowed = [];
  const newBalances = {};

  globalThis.SmartWeave = {
    transaction: {
      reward: reward || 1,
      id: id || '<test-tx>',
    },
    block: {
      height: height || 1,
    },
    contracts: {
      readContractState: async (contract) => readContractState,
      write: async (pair, input) => {
        if (input.function === 'reject') rejected.push(input.tx);
        if (input.function === 'register') registered.push(input.tx);
        if (input.function === 'claim') claimed.push(input.txID);
        if (input.function === 'allow') allowed.push(input.target);
        if (input.function === 'transfer') {
          const balance = newBalances[input.target] || 0;
          newBalances[input.target] = balance + input.qty;
        }
        return {
          type: write ? 'ok' : 'error',
        };
      },
      viewContractState: async (contract, input) => ({
        result: viewContractState,
      }),
    },
    kv: {
      get: async (key) => map.get(key),
      put: async (caller, qty) => map.set(caller, qty),
      del: async (key) => map.delete(key),
    },
  };
  globalThis.ContractError = ContractError;
  return {
    kv: SmartWeave.kv,
    contracts: SmartWeave.contracts,
    block: SmartWeave.block,
    transaction: SmartWeave.transaction,
    registered: () => registered,
    rejected: () => rejected,
    claimed: () => claimed,
    allowed: () => allowed,
    balances: () => newBalances,
  };
}

class ContractError {
  constructor(error) {
    throw new Error(error);
  }
}
