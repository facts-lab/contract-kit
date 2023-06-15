import { validateUserIsModerator } from "../util";

export async function addCoin(state, action) {
  const { caller, input } = action;
  const { coins } = state;

  validateUserIsModerator(caller);

  const newCoin = {
    name: input.coin.name,
    symbol: input.coin.symbol,
    ranking: input.coin.ranking,
    image: input.coin.image,
    tags: input.coin.tags || [],
    attributeLinks: input.coin.attributeLinks || [],
    whatIsCoin: input.coin.whatIsCoin,
  };

  coins.push(newCoin);

  return { state };
}
