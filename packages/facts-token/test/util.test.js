import { suite } from "uvu";
import * as assert from "uvu/assert";
import { vouchedWallets } from "../src/util.js";
import { setupSmartWeaveEnv } from "./setup.js";

const util = suite("util");

util("should work", async () => {
  setupSmartWeaveEnv(1, 20);
  const wallets = await vouchedWallets({}, {});
  console.log("WALLETS", wallets);
  assert.equal(1, 1);
});

util.run();
