export async function balance(state, action) {
  const addr = action?.input?.target || action.caller;
  return {
    result: {
      target: addr,
      ticker: state.ticker,
      balance: state.balances[addr] || 0,
      balances: {
        support: state.balances[addr] || 0,
        oppose: state.oppose[addr] || 0,
      },
    },
  };
}
