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

  // Update initial state with the wallet as a moderator crewMember
  const initialState = {
    ...state,
    crew: [
      ...state.crew,
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
  // Call the updateCoin function
  await connectedWallet1.writeInteraction(
    {
      function: "updateCoin",
      coin: {
        symbol: "TST",
        name: "UpdatedTestCoin",
        ranking: 1,
      },
    },
    {}
  );

  // Read the state of the contract
  const state = (await connectedWallet1.readState()).cachedValue.state;

  // Check if the coin was updated
  const updatedCoin = state.coins.find((coin) => coin.symbol === "TST");
  console.log("updated coin and state", updatedCoin, state);
  assert.is(updatedCoin.name, "UpdatedTestCoin", "Coin was not updated");
});

test("should update all coins", async () => {
  // Add some coins
  await connectedWallet1.writeInteraction({
    function: "addCoin",
    coin: {
      name: "TestCoin1",
      symbol: "TST1",
      ranking: 100,
      image: "https://example.com/testcoin1.png",
      tags: [{ name: "TestTag", value: "TestValue" }],
      attributeLinks: [{ name: "TestLink", value: "https://example.com" }],
      whatIsCoin: "A test coin",
    },
  });

  await connectedWallet1.writeInteraction({
    function: "addCoin",
    coin: {
      name: "TestCoin2",
      symbol: "TST2",
      ranking: 200,
      image: "https://example.com/testcoin2.png",
      tags: [{ name: "TestTag", value: "TestValue" }],
      attributeLinks: [{ name: "TestLink", value: "https://example.com" }],
      whatIsCoin: "A second test coin",
    },
  });

  // Call the updateCoins function
  await connectedWallet1.writeInteraction(
    {
      function: "updateCoins",
      coins: [
        {
          symbol: "TST1",
          name: "UpdatedTestCoin1",
          ranking: 50,
        },
        {
          symbol: "TST2",
          name: "UpdatedTestCoin2",
          ranking: 150,
        },
      ],
    },
    {}
  );

  // Read the state of the contract
  const state = (await connectedWallet1.readState()).cachedValue.state;

  // Check if the coins were updated
  const updatedCoin1 = state.coins.find((coin) => coin.symbol === "TST1");
  const updatedCoin2 = state.coins.find((coin) => coin.symbol === "TST2");

  console.log("Updated coins and state", updatedCoin1, updatedCoin2, state);
  assert.is(updatedCoin1.name, "UpdatedTestCoin1", "Coin1 was not updated");
  assert.is(updatedCoin2.name, "UpdatedTestCoin2", "Coin2 was not updated");
});

test("should get a coin", async () => {
  // Call the getCoin function
  const result = await connectedWallet1.viewState({
    function: "getCoin",
    symbol: "TST",
  });

  // Check if the coin was retrieved
  assert.is(result.result.name, "UpdatedTestCoin", "Coin was not retrieved");
});

test("should get all coins", async () => {
  // Call the getAllCoins function
  const response = await connectedWallet1.viewState({
    function: "getCoins",
  });

  console.log("Response from getCoins:", response, response.result[0].tags);

  assert.ok(response.result.length > 0, "No coins found");
});

test("should get coins by ranking", async () => {
  // Call the getCoinsByRanking function
  const response = await connectedWallet1.viewState({
    function: "getCoinsByRanking",
  });

  console.log("Response from getCoinsByRanking:", response);

  // Check if the coins are in the correct order
  const coins = response.result;
  for (let i = 0; i < coins.length - 1; i++) {
    assert.ok(
      coins[i].ranking <= coins[i + 1].ranking,
      "Coins are not sorted by ranking"
    );
  }
});

test("should delete a coin", async () => {
  // Call the deleteCoin function with a coin symbol of "TST"
  await connectedWallet1.writeInteraction({
    function: "deleteCoin",
    symbol: "TST",
  });

  // Read the state of the contract
  const state = (await connectedWallet1.readState()).cachedValue.state;

  // Make sure the coin was deleted
  const deletedCoin = state.coins.find((coin) => coin.symbol === "TST");
  console.log("Deleted Coin:", deletedCoin);
  assert.ok(!deletedCoin, "Coin was not deleted");
});

test.after(async () => {
  await arlocal.stop();
});

test.run();
