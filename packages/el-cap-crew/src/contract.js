import { updateWatchlist } from "./write/updateWatchlist";

export async function handle(state, action) {
  const input = action.input;

  switch (input.function) {
    case "updateWatchlist":
      return await updateWatchlist(state, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognized`
      );
  }
}
