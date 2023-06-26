export async function addMultipleCoinsToWatchlist(state, action) {
  const caller = action.caller;
  const input = action.input;
  const tickers = input.tickers; // Expecting an array of tickers

  if (!Array.isArray(tickers)) {
    throw new ContractError("No tickers provided or not an array");
  }

  // Only the registered crewMember can update their watchlist
  if (state.owner !== caller) {
    throw new ContractError("Caller is not the registered crewMember");
  }

  tickers.forEach((ticker) => {
    if (!state.watchlist.includes(ticker)) {
      // Ticker is not on the watchlist, so we add it
      state.watchlist.push(ticker);
    }
  });

  return { state };
}
