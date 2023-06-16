export async function getCoin(state, action) {
  const { coins } = state;
  const { input } = action;
  const { symbol } = input;

  const coin = coins.find((coin) => coin.symbol === symbol);

  if (!coin) {
    throw new ContractError(`No coin found with symbol: ${symbol}`);
  }

  return { result: coin };
}
