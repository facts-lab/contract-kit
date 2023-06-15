import { validateUserIsModerator } from "../util";

export async function deleteCoin(state, action) {
  const { coins, users } = state;
  const { input } = action;
  const { symbol, caller } = input;

  const user = users.find((user) => user.address === caller);

  validateUserIsModerator(user);

  const coinIndex = coins.findIndex((coin) => coin.symbol === symbol);

  if (coinIndex === -1) {
    throw new ContractError(`No coin found with symbol: ${symbol}`);
  }

  coins.splice(coinIndex, 1);

  return { state };
}
