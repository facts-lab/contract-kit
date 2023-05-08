import { Left, Right, of, tryCatch, fromNullable } from "../hyper-either.js";

/**
 * @description
 *
 * @author @jshaw-ar
 * @export
 * @param {*} state
 * @param {input: { to, amount }} action
 * @return {*}
 */
export function balanceOf(state, action) {
  console.log("TEST");
  return of(null)
    .chain(fromNullable)
    .map((o) => o * 2)
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
