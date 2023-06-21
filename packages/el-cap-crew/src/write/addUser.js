export async function addUser(state, action) {
  const caller = action.caller;

  // Check if user is already registered
  if (state.users[caller]) {
    throw new ContractError("User is already registered");
  }

  // Each user is an object with a watchlist
  const newUser = {
    watchlist: [], // empty watchlist
  };

  state.users[caller] = newUser;

  return { state };
}
