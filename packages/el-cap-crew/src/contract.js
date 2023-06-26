import { addMultipleCoinsToWatchlist } from "./write/addMultipleCoinsToWatchlist";
import { updateWatchlist } from "./write/updateWatchlist";

export async function handle(state, action) {
  const input = action.input;

  switch (input.function) {
    case "updateWatchlist":
      return await updateWatchlist(state, action);
    case "addMultipleCoinsToWatchlist":
      return await addMultipleCoinsToWatchlist(state, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognized`
      );
  }
}
