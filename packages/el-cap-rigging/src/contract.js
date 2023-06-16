import { getCoins } from "./read/getCoins.js";
import { getCoin } from "./read/getCoin.js";
import { getCoinsByRanking } from "./read/getCoinsByRanking.js";
import { addCoin } from "./write/addCoin.js";
import { updateCoins } from "./write/updateCoins.js";
import { updateCoin } from "./write/updateCoin.js";
import { deleteCoin } from "./write/deleteCoin.js";

export async function handle(state, action) {
  const input = action.input;

  switch (input.function) {
    case "getCoins":
      return await getCoins(state, action);
    case "getCoin":
      return await getCoin(state, action);
    case "getCoinsByRanking":
      return await getCoinsByRanking(state, action);
    case "addCoin":
      return await addCoin(state, action);
    case "updateCoins":
      return await updateCoins(state, action);
    case "updateCoin":
      return await updateCoin(state, action);
    case "deleteCoin":
      return await deleteCoin(state, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognized`
      );
  }
}
