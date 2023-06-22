import { validateCrewMemberIsModerator } from "../util";

export async function deleteCoin(state, action) {
  const { coins, crew } = state;
  const { input } = action;
  const { symbol, caller } = input;

  const crewMember = crew.find((crewMember) => crewMember.address === caller);

  const coinIndex = coins.findIndex((coin) => coin.symbol === symbol);

  if (coinIndex === -1) {
    throw new ContractError(`No coin found with symbol: ${symbol}`);
  }

  coins.splice(coinIndex, 1);

  return { state };
}
