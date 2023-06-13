import { getCurrentSupply } from '../util.js';

export async function getOppositionCap(state) {
  return {
    result: {
      cap: getCurrentSupply(state.oppositionBalances),
    },
  };
}
