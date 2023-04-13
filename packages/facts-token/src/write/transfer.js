import { Left, Right, of, tryCatch, fromNullable } from "../hyper-either.js";

export function transfer(state, action) {
  console.log("TEST");
  const output = of(null)
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
  console.log("OUTPUUT", output);

  return output;
}
