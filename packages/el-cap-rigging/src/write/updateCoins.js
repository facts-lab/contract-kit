import { validateUserIsModerator } from "../util";

export async function updateCoins(state, action) {
  const { caller, input } = action;
  const { coins } = state;

  const newCoins = input.coins;

  newCoins.forEach((newCoin) => {
    const index = coins.findIndex((coin) => coin.symbol === newCoin.symbol);

    if (index !== -1) {
      coins[index] = {
        ...coins[index],
        ...newCoin,
      };
    }
  });

  return { state };
}
