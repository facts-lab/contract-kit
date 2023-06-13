import { getCurrentSupply } from '../util.js';

export async function getTotalCap(state) {
  return {
    result: {
      cap:
        getCurrentSupply(state.balances) +
        getCurrentSupply(state.oppositionBalances),
    },
  };
}
