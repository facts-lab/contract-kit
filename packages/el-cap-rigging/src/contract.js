import { getCoins } from "./read/getCoins";
import { getCoin } from "./read/getCoin";
import { getCoinsByRanking } from "./read/getCoinsByRanking";
import { getCoinsByTag } from "./read/getCoinsByTag";
import { addCoin } from "./write/addCoin";
import { updateCoins } from "./write/updateCoins";
import { updateCoin } from "./write/updateCoin";
import { deleteCoin } from "./write/deleteCoin";

export async function handle(state, action) {
  const input = action.input;

  switch (input.function) {
    case "getCoins":
      return await getCoins(state, action);
    case "getCoin":
      return await getCoin(state, action);
    case "getCoinsByRanking":
      return await getCoinsByRanking(state, action);
    case "getCoinsByTag":
      return await getCoinsByTag(state, action);
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
