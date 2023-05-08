import { Left, Right, of, fromNullable } from "../hyper-either.js";

/**
 * @description
 *
 * @author @jshaw-ar
 * @export
 * @param {*} state
 * @param {input: { to, amount }} action
 * @return {state}
 */
export function transfer(state, action) {
  return of({ state, action })
    .chain(fromNullable)
    .chain(ca(!Number.isInteger(action.input.amount), "Invalid quantity"))
    .chain(ca(!action.input.to, "Target 'to' is required."))
    .chain(ca(action.input.amount > 1, "Invalid token transfer."))
    .chain(
      ca(!state.balances[action.caller], "Caller does not have a balance.")
    )
    .chain(
      ca(
        state.balances[action.caller] < action.input.amount,
        "Caller does not have a balance."
      )
    )
    .map(zeroBalance)
    .fold(
      (p) => {
        console.log("left", p);
      },
      (p) => {
        console.log("right", p);
        return p;
      }
    );
}

function zeroBalance({ state, action }) {
  if (state.balances[action.caller]) return { state, action };
  const balances = {
    ...state.balances,
    [action.caller]: 0,
  };
  return {
    state: {
      ...state,
      balances,
    },
  };
}
