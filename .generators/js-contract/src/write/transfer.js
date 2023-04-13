import {
  validateBalance,
  validateBalanceGreaterThanQuantity,
  validateQuantityGreaterThanZero,
  validateTarget,
} from '../util';

export async function transfer(state, action) {
  const { balances } = state;
  const { caller, input } = action;
  const { qty, target } = input;
  validateQuantityGreaterThanZero(qty);

  validateTarget(caller, target);

  validateBalanceGreaterThanQuantity(balances[caller], qty);

  balances[caller] -= qty;
  if (!balances[target]) {
    balances[target] = 0;
  }

  balances[target] += qty;
  validateBalance(balances[caller]);
  validateBalance(balances[target]);
  return { state };
}
