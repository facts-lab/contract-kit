export async function getCoinsByRanking(state, action) {
  const { coins } = state;
  const { input } = action;
  const { limit } = input;

  const topRankedCoins = coins
    .sort((a, b) => a.ranking - b.ranking)
    .slice(0, limit);

  return { result: topRankedCoins };
}
