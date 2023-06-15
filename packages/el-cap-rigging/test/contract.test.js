import { suite } from "uvu";
import * as assert from "uvu/assert";
import { WarpFactory, LoggerFactory } from "warp-contracts/mjs";
import { DeployPlugin } from "warp-contracts-plugin-deploy";
import ArLocal from "arlocal";
import * as fs from "fs";

// Things that need to be used in multiple blocks
// for example, we start arlocal in the .before() and stop it in the .after()
let warp;
let wallet1;
let connectedWallet1;
let arlocal;

const test = suite("contract");

test.before(async () => {
  arlocal = new ArLocal.default();
  await arlocal.start();
  LoggerFactory.INST.logLevel("error");
  warp = WarpFactory.forLocal().use(new DeployPlugin());

  // Generate a wallet
  wallet1 = await warp.generateWallet();

  // Grab the contract and initial state
  const prefix = `./dist/`;
  const contractSrc = fs.readFileSync(`${prefix}contract.js`, "utf8");
  const state = JSON.parse(
    fs.readFileSync(`${prefix}initial-state.json`, "utf8")
  );

  // Update initial state with the wallet as a moderator user
  const initialState = {
    ...state,
    users: [
      ...state.users,
      {
        address: wallet1.address,
        role: "moderator",
        watchlist: [],
      },
    ],
    coins: [],
  };

  // Deploy contract
  const { contractTxId } = await warp.deploy({
    wallet: wallet1.jwk,
    initState: JSON.stringify(initialState),
    src: contractSrc,
  });

  // Connect wallet to contract
  connectedWallet1 = warp
    .contract(contractTxId)
    .setEvaluationOptions({ internalWrites: true, mineArLocalBlocks: true })
    .connect(wallet1.jwk);
});

test("should add a coin", async () => {
  console.log("Calling addCoin function...");

  // Call the addCoin function
  const writeResult = await connectedWallet1.writeInteraction(
    {
      function: "addCoin",
      coin: {
        name: "TestCoin",
        symbol: "TST",
        ranking: 100,
        image: "https://example.com/testcoin.png",
        tags: [{ name: "TestTag", value: "TestValue" }],
        attributeLinks: [{ name: "TestLink", value: "https://example.com" }],
        whatIsCoin: "A test coin",
      },
    },
    {}
  );

  console.log("Write Result: ", writeResult);

  // Read the state of the contract
  const readResult = await connectedWallet1.readState();
  const state = readResult.cachedValue.state;

  console.log("State of the contract: ", state, connectedWallet1);

  // Check if the coin was added
  const addedCoin = state.coins.find((coin) => coin.symbol === "TST");
  console.log("Added Coin: ", addedCoin);

  assert.ok(addedCoin, "Coin was not added");
});

test("should update a coin", async () => {
  // TODO: Implement test
});

test("should update all coins", async () => {
  // TODO: Implement test
});

test("should get a specific coin", async () => {
  // TODO: Implement test
});

test("should get all coins", async () => {
  // TODO: Implement test
});

test("should get coins by ranking", async () => {
  // TODO: Implement test
});

test("should get coins by tag", async () => {
  // TODO: Implement test
});

test("should delete a coin", async () => {
  // TODO: Implement test
});

test.after(async () => {
  await arlocal.stop();
});

test.run();
