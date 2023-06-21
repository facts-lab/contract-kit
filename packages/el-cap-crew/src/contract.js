import { addToWatchlist } from "./write/addToWatchlist";
import { removeFromWatchlist } from "./write/removeFromWatchlist";
import { addUser } from "./write/addUser";

export async function handle(state, action) {
  const input = action.input;

  switch (input.function) {
    case "addToWatchlist":
      return await addToWatchlist(state, action);
    case "removeFromWatchlist":
      return await removeFromWatchlist(state, action);
    case "addUser":
      return await addUser(state, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognized`
      );
  }
}
