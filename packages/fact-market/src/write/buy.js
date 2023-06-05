import Async from 'hyper-async';
const { of, fromPromise } = Async;
import { of as syncOf, fromNullable } from '../hyper-either.js';
import {
  POSITION_TYPES,
  calculatePrice,
  ce,
  getBalances,
  getCurrentSupply,
  roundUp,
  roundDown,
  isInteger,
  getFee,
} from '../util.js';

// validate
// transform
// update

/**
 * @description Purchases support or opppose tokens with the pair.
 *
 * @author @jshaw-ar
 * @export
 * @param {*} { write, transaction }
 * @return {*}
 */
export function buy({ contracts, transaction }) {
  return async (state, action) =>
    of({ state, action })
      .map(validate)
      .map(transform)
      .chain(({ price, fee }) =>
        fromPromise(claimPair)({
          price,
          fee,
          pair: state.pair,
          tx: action.input.tx,
          contracts,
        })
      )

      // Next 4 steps Only rejects if input is "error" (result from write / claimPair)
      .chain(({ type, price, fee }) =>
        fromPromise(rejectClaim)({
          type,
          price,
          fee,
          pair: state?.pair,
          tx: transaction.id,
          contracts,
        })
      )

      .map(({ type, price, fee }) =>
        creatorCut({ type, price, fee, state, action })
      )
      .map(({ type, price, fee }) =>
        updateBalance({ type, price, fee, state, action })
      )
      .chain(({ type, price, fee }) =>
        fromPromise(registerInteraction)({
          type,
          price,
          fee,
          contracts,
          tx: transaction.id,
        })
      )
      .fork(
        (msg) => {
          console.log('ERROR', msg);
          throw new ContractError(msg || 'An error occurred.');
        },
        () => ({ state })
      );
}

const validate = ({ state, action }) =>
  syncOf({ state, action })
    .chain(fromNullable)
    .chain(
      ce(
        !POSITION_TYPES.includes(action?.input?.positionType),
        'positionType must be support or oppose.'
      )
    )
    .chain(
      ce(
        !isInteger(roundDown(action?.input?.qty)),
        'qty must be an integer greater than zero.'
      )
    )
    .chain(
      ce(
        roundDown(action?.input?.qty) < 1,
        'qty must be an integer greater than zero.'
      )
    )
    .chain(ce(!action?.input?.tx, 'tx is required.'))
    .fold(
      (msg) => {
        throw new ContractError(msg || 'An error occurred.');
      },
      () => ({
        state,
        action,
      })
    );

const transform = ({ state, action }) => {
  return syncOf({ state, action })
    .map(getBalances)
    .map(getCurrentSupply)
    .map((supply) =>
      roundUp(
        calculatePrice(1, 1, supply, supply + roundDown(action.input.qty))
      )
    )
    .map(getFee)
    .chain(({ price, fee }) =>
      ce(price !== action.input.price, 'Incorrect price.')({ price, fee })
    )
    .chain(({ price, fee }) =>
      ce(fee !== action.input.fee, 'Incorrect fee.')({ price, fee })
    )
    .fold(
      (msg) => {
        throw new ContractError(msg || 'An error occurred.');
      },
      (input) => input
    );
};

/**
 * @desription Uses Foreign Call Protocol to claim a transfer from the pair.
 *
 * @author @jshaw-ar
 * @param {*} { price, fee, state, action, write, transaction }
 * @returns {*} { price, fee, state, action, write, transaction }
 */
const claimPair = async ({ price, fee, pair, tx, contracts }) => {
  const result = await contracts.write(pair, {
    function: 'claim',
    txID: tx,
    qty: price + fee,
  });
  return {
    type: result.type,
    price,
    fee,
  };
};

/**
 * @desription Uses Foreign Call Protocol to claim a transfer from the pair.
 *
 * @author @jshaw-ar
 * @param {*} { price, fee, state, action, write, type, transaction }
 * @returns {*} { price, fee, state, action, write, type, transaction }
 */
const rejectClaim = async ({ type, price, fee, pair, tx, contracts }) => {
  if (type === 'error') {
    await contracts.write(pair, {
      function: 'reject',
      tx,
    });
  }
  return { type, price, fee };
};

/**
 * @description Adds fee to the creator balance if positionType is the same as state.position
 *
 * @author @jshaw-ar
 * @param {*} { price, fee, state, action, write, type, transaction }
 * @return {*} { price, fee, state, action, write, type, transaction }
 */
const creatorCut = ({ type, price, fee, state, action }) => {
  if (type === 'ok') {
    if (action.input.positionType === state.position) {
      state.creator_cut = (state.creator_cut || 0) + fee;
    }
  }
  return { type, price, fee };
};

/**
 * Updates the support or opposition balance of the caller
 *
 * @author @jshaw-ar
 * @param {*} { price, fee, state, action, write, type, transaction }
 * @return {*} { price, fee, state, action, write, type, transaction }
 */
const updateBalance = ({ type, price, fee, state, action }) => {
  if (type === 'ok') {
    if (action.input.positionType === 'support') {
      state.balances[action.caller] =
        (state.balances[action.caller] || 0) + action.input.qty;
    } else {
      state.oppositionBalances[action.caller] =
        (state.oppositionBalances[action.caller] || 0) + action.input.qty;
    }
  }
  return { type, price, fee };
};

/**
 * @description Registers interaction with the registry contract
 *
 * @author @jshaw-ar
 * @param {*} {
 *   price,
 *   fee,
 *   state,
 *   write,
 *   transaction,
 *   type,
 * }
 */
const registerInteraction = async ({ type, price, fee, contracts, tx }) => {
  if (type === 'ok') {
    await contracts.write('<FACTS_CONTRACT_ID>', {
      function: 'register',
      tx: tx,
      qty: price + fee,
    });
  }
};
