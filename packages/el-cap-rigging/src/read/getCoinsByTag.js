export async function getCoinsByTag(state, action) {
  const { coins } = state;
  const { input } = action;
  const { tag } = input;

  const filteredCoins = coins.filter((coin) =>
    coin.tags.some((coinTag) => coinTag.name === tag)
  );

  return { result: filteredCoins };
}
