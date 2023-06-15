import { validateUserIsModerator } from "../util";

export async function addCoin(state, action) {
  const { caller, input } = action;
  const { coins } = state;

  validateUserIsModerator(caller);

  const newCoin = {
    name: input.name,
    symbol: input.symbol,
    ranking: input.ranking,
    image: input.image,
    tags: input.tags || [],
    attributeLinks: input.attributeLinks || [],
    whatIsCoin: input.whatIsCoin,
  };

  coins.push(newCoin);

  return { state };
}
