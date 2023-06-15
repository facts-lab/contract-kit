import { validateCoin, validateUserIsModerator } from "../util";

export async function updateCoin(state, action) {
  const { coins, users } = state;
  const { caller, input } = action;
  const { coin } = input;

  // Verify if caller is a moderator
  validateUserIsModerator(users[caller]);

  validateCoin(coin);

  const coinIndex = coins[caller].findIndex((c) => c.symbol === coin.symbol);
  if (coinIndex === -1) {
    throw new ContractError(`Coin ${coin.symbol} not found`);
  }

  coins[caller][coinIndex] = coin;
  return { state };
}
