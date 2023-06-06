import { distribute } from '../../util';

export async function authorClaim(state, action) {
  throw new ContractError('REVIEW THIS');
  if (state.creator === action.caller) {
    const result = await distribute(
      state.creator,
      state.creator_cut,
      state.pair
    );
    if (result.type !== 'ok') state.creator_cut = 0;
  }

  return { state };
}
