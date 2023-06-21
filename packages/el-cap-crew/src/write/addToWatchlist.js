export async function addToWatchlist(state, action) {
  const caller = action.caller;
  const input = action.input;
  const newTicker = input.ticker;

  if (!newTicker) {
    throw new ContractError("No ticker provided");
  }

  let user = state.users[caller];

  if (!user) {
    throw new ContractError("Caller is not a registered user");
  }

  if (user.watchlist.includes(newTicker)) {
    throw new ContractError("Ticker is already on watchlist");
  }

  user.watchlist.push(newTicker);
  return { state };
}
