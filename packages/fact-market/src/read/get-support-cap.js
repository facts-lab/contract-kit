import { getCurrentSupply } from '../util.js';

// is there a standard for this?
export async function getSupportCap(state) {
  return {
    result: {
      cap: getCurrentSupply(state.balances),
    },
  };
}
