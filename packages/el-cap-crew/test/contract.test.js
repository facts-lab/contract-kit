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

  // Update initial state giving the wallet 100
  const initialState = {
    ...state,
    ...{
      owner: wallet1.address,
      watchlist: [],
    },
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

test("should add to watchlist", async () => {
  const newTicker = "NEW";

  // add to watchlist
  await connectedWallet1.writeInteraction(
    {
      function: "updateWatchlist",
      ticker: newTicker,
    },
    {}
  );

  // get updated state
  const state = (await connectedWallet1.readState()).cachedValue.state;
  console.log("state", state);

  // check if ticker was added to watchlist
  assert.ok(
    state.watchlist.includes(newTicker),
    "Ticker not added to watchlist"
  );
});

test("should remove from watchlist", async () => {
  const tickerToRemove = "NEW";

  let state = (await connectedWallet1.readState()).cachedValue.state;

  console.log("state2", state);
  assert.ok(
    state.watchlist.includes(tickerToRemove),
    "Ticker not added to watchlist"
  );

  // remove from watchlist
  await connectedWallet1.writeInteraction(
    {
      function: "updateWatchlist",
      ticker: tickerToRemove,
    },
    {}
  );

  // get updated state
  state = (await connectedWallet1.readState()).cachedValue.state;

  // check if ticker was removed from watchlist
  assert.not.ok(
    state.watchlist.includes(tickerToRemove),
    "Ticker not removed from watchlist"
  );
});

test("should add multiple tickers to watchlist", async () => {
  const newTickers = ["NEW1", "NEW2", "NEW3"];

  // add multiple tickers to watchlist
  await connectedWallet1.writeInteraction(
    {
      function: "addMultipleCoinsToWatchlist",
      tickers: newTickers,
    },
    {}
  );

  // get updated state
  const state = (await connectedWallet1.readState()).cachedValue.state;

  // check if tickers were added to watchlist
  newTickers.forEach((ticker) => {
    assert.ok(
      state.watchlist.includes(ticker),
      `Ticker ${ticker} not added to watchlist`
    );
  });
});

test.after(async () => {
  await arlocal.stop();
});

test.run();
