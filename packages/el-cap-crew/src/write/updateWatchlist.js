export async function updateWatchlist(state, action) {
  const caller = action.caller;
  const input = action.input;
  const ticker = input.ticker;

  if (!ticker) {
    throw new ContractError("No ticker provided");
  }

  // Only the registered crewMember can update their watchlist
  if (state.owner !== caller) {
    throw new ContractError("Caller is not the registered crewMember");
  }

  if (state.watchlist.includes(ticker)) {
    // Ticker is on the watchlist, so we remove it
    state.watchlist = state.watchlist.filter((t) => t !== ticker);
  } else {
    // Ticker is not on the watchlist, so we add it
    state.watchlist.push(ticker);
  }

  return { state };
}
