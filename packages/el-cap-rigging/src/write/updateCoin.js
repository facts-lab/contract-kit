export async function updateCoin(state, action) {
  const { coins, crew } = state;
  const { caller, input } = action;
  const { coin: updatedCoin } = input;

  const coinIndex = coins.findIndex((c) => c.symbol === updatedCoin.symbol);
  if (coinIndex === -1) {
    throw new ContractError(`Coin ${updatedCoin.symbol} not found`);
  }

  // Get the old coin
  const oldCoin = coins[coinIndex];

  // Update the coin with new properties and keep the old ones
  const newCoin = {
    ...oldCoin,
    ...updatedCoin,
  };

  coins[coinIndex] = newCoin;

  return { state };
}
