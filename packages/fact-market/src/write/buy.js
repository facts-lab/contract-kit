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

export function buy({ write, transaction }) {
  return async (state, action) => {
    return (
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
        .map(getBalances)
        .map(getCurrentSupply)
        .map((supply) =>
          roundUp(
            calculatePrice(1, 1, supply, supply + roundDown(action.input.qty))
          )
        )
        .map(getFee)
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
        .chain(({ price, fee, state, action }) =>
          fromPromise(claimPair)({
            price,
            fee,
            state,
            action,
            write,
            transaction,
          })
        )
        .chain(fromPromise(rejectClaim)) // Only rejects if claim returns "error"
        // The next 3 steps only run if claim returns "ok"
        .map(creatorCut)
        .map(updateBalance)
        .chain(fromPromise(registerInteraction))
        .fork(
          (msg) => {
            throw new ContractError(msg || 'An error occurred.');
          },
          () => ({ state })
        )
    );
  };
}

/**
 * @desription Uses Foreign Call Protocol to claim a transfer from the pair.
 *
 * @author @jshaw-ar
 * @param {*} { pair, txId, qty, write }
 */
const claimPair = async ({ price, fee, state, action, write, transaction }) => {
  const result = await write(state.pair, {
    function: 'claim',
    txID: action.input.txId,
    qty: price + fee,
  });
  return { price, fee, state, action, write, type: result.type, transaction };
};

/**
 * @desription Uses Foreign Call Protocol to claim a transfer from the pair.
 *
 * @author @jshaw-ar
 * @param {*} { pair, txId, qty, write }
 */
const rejectClaim = async ({
  price,
  fee,
  state,
  action,
  write,
  type,
  transaction,
}) => {
  if (type === 'error') {
    await write(state.pair, {
      function: 'reject',
      tx: action.input.txId,
    });
  }
  return { price, fee, state, action, write, type, transaction };
};

/**
 * @description Adds fee to the creator balance if positionType is the same as state.position
 *
 * @author @jshaw-ar
 * @param {*} { price, fee, state, action }
 * @return {*}
 */
const creatorCut = ({
  price,
  fee,
  state,
  action,
  write,
  type,
  transaction,
}) => {
  if (type === 'ok') {
    if (action.input.positionType === state.position) {
      state.creator_cut = (state.creator_cut || 0) + fee;
    }
  }
  return { price, fee, state, action, write, type, transaction };
};

/**
 * Updates the support or opposition balance of the caller
 *
 * @author @jshaw-ar
 * @param {*} { price, fee, state, action, write, type }
 * @return {*} {pair, txId, qty}
 */
const updateBalance = ({
  price,
  fee,
  state,
  action,
  write,
  type,
  transaction,
}) => {
  if (type === 'ok') {
    const { input, caller } = action;
    const { positionType, qty } = input;
    if (positionType === 'support') {
      state.balances[caller] = (state.balances[caller] || 0) + qty;
    } else {
      state.oppositionBalances[caller] =
        (state.oppositionBalances[caller] || 0) + qty;
    }
  }
  return { price, fee, state, action, write, type, transaction };
};

const registerInteraction = async ({
  price,
  fee,
  state,
  write,
  transaction,
  type,
}) => {
  if (type === 'ok') {
    await write(state.registry, {
      function: 'register',
      tx: transaction.id,
      qty: price + fee,
    });
  }
};
