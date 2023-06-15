export async function getCoins(state) {
  const { coins } = state;
  return { result: coins };
}
