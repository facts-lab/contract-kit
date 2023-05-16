import Async from 'hyper-async';
const { of, fromPromise } = Async;
import {
  POSITION_TYPES,
  calculatePrice,
  ceAsync,
  getBalances,
  getCurrentSupply,
  roundUp,
  roundDown,
  isInteger,
  getFee,
} from '../util.js';

export function buyPipe({ write }) {
  return async (state, action) =>
    of({ state, action })
      .chain(
        ceAsync(
          !POSITION_TYPES.includes(action?.input?.positionType),
          'positionType must be support or oppose.'
        )
      )
      .chain(
        ceAsync(
          !isInteger(roundDown(action?.input?.qty)),
          'qty must be an integer greater than zero.'
        )
      )
      .chain(
        ceAsync(
          roundDown(action?.input?.qty) < 1,
          'qty must be an integer greater than zero.'
        )
      )
      .chain(ceAsync(!action?.input?.txId, 'txId is required.'))
      // get balances
      .map(getBalances)
      .map(getCurrentSupply)
      .map((supply) =>
        roundUp(
          calculatePrice(1, 1, supply, supply + roundDown(action.input.qty))
        )
      )
      .map(getFee)
      // check if price/fee is correct
      .chain(({ price, fee }) =>
        ceAsync(
          price !== action.input.price,
          'Incorrect price.'
        )({ price, fee })
      )
      .chain(({ price, fee }) =>
        ceAsync(fee !== action.input.fee, 'Incorrect fee.')({ price, fee })
      )
      .map(({ price, fee }) => ({ price, fee, state, action }))
      .map(creatorCut)
      .map(updateBalance)
      .chain(({ pair, txId, qty }) =>
        fromPromise(claimPair)({ pair, txId, qty, write })
      )
      .fork(
        (msg) => {
          throw new ContractError(msg || 'An error occurred.');
        },
        () => ({ state })
      );
}

/**
 * @desription Uses Foreign Call Protocol to claim a transfer from the pair.
 *
 * @author @jshaw-ar
 * @param {*} { pair, txId, qty, write }
 */
const claimPair = async ({ pair, txId, qty, write }) => {
  const result = await write(pair, {
    function: 'claim',
    txID: txId,
    qty,
  });
  if (result.type !== 'ok') {
    throw new ContractError(`An error occurred while claiming the pair.`);
  }
};

/**
 * @description Adds fee to the creator balance if positionType is the same as state.position
 *
 * @author @jshaw-ar
 * @param {*} { price, fee, state, action }
 * @return {*}
 */
const creatorCut = ({ price, fee, state, action }) => {
  if (action.input.positionType === state.position) {
    state.creator_cut = (state.creator_cut || 0) + fee;
  }
  return { price, fee, state, action };
};

/**
 * Updates the support or opposition balance of the caller
 *
 * @author @jshaw-ar
 * @param {*} { price, fee, state, action }
 * @return {*} {pair, txId, qty}
 */
const updateBalance = ({ price, fee, state, action }) => {
  const { input, caller } = action;
  const { positionType, qty } = input;
  if (positionType === 'support') {
    state.balances[caller] = (state.balances[caller] || 0) + qty;
  } else {
    state.oppositionBalances[caller] =
      (state.oppositionBalances[caller] || 0) + qty;
  }
  return { pair: state.pair, txId: action.input.txId, qty: price + fee };
};
