export async function removeFromWatchlist(state, action) {
  const caller = action.caller;
  const input = action.input;
  const tickerToRemove = input.ticker;

  if (!tickerToRemove) {
    throw new ContractError("No ticker provided");
  }

  let user = state.users[caller];

  if (!user) {
    throw new ContractError("Caller is not a registered user");
  }

  if (!user.watchlist.includes(tickerToRemove)) {
    throw new ContractError("Ticker is not on watchlist");
  }

  user.watchlist = user.watchlist.filter((ticker) => ticker !== tickerToRemove);
  return { state };
}
