import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { WarpFactory, LoggerFactory, SourceType } from 'warp-contracts/mjs';
import { DeployPlugin, ArweaveSigner } from 'warp-contracts-plugin-deploy';
// import ArLocal from 'arlocal';
import * as fs from 'fs';
// import { toPairs } from 'ramda';

// Things that need to be used in multiple blocks
// for example, we start arlocal in the .before() and stop it in the .after()
let warp;
let wallet1;
let connectedWallet1U;
let connectedWallet1FactsToken;
let connectedWallet1FactMarket;
let wallet2;
let connectedWallet2U;
let connectedWallet2FactsToken;
let connectedWallet2FactMarket;
let arlocal;
// This will be set after allow, and be used for claiming
let allowTxForClaim1;
let allowTxForClaim2;

//
let contractU;
let contractFactsToken;
let contractFactMarket;

const TEST_U_TX = 'FYJOKdtNKl18QgblxgLEZUfJMFUv6tZTQqGTtY-D6jQ';
const TEST_FACTS_TX = '5rIZkU4XSHV5yGqFdWznFedztgxhBb51YlZelXeyFAg';
const TEST_MARKETPLACE_TX = 'QzqLKlswebY0u6wpvG8bwe0_xuZfNig1EVLMIPbEVSc';
const test = suite('full-integration-prod');
const DEPLOY_CONTRACTS = process.env.DEPLOY_CONTRACTS;
test.before(async () => {
  const jwk = JSON.parse(
    fs.readFileSync(process.env.PATH_TO_WALLET).toString()
  );

  LoggerFactory.INST.logLevel('error');
  warp = WarpFactory.forMainnet().use(new DeployPlugin());

  // Grab the contract and initial state
  if (DEPLOY_CONTRACTS === 'true') {
    const prefix = `./dist/`;
    const integrationsPrefux = `./contract-integrations/`;
    const contractSrcFactsToken = fs.readFileSync(
      `${prefix}contract.js`,
      'utf8'
    );
    // const contractSrcU = fs.readFileSync(
    //   `${integrationsPrefux}u/contract.js`,
    //   'utf8'
    // );
    const contractSrcFactMarket = fs.readFileSync(
      `${integrationsPrefux}fact-market/dist/contract.js`,
      'utf8'
    );

    const initialStateFactsToken = JSON.parse(
      fs.readFileSync(`${prefix}initial-state.json`, 'utf8')
    );
    // const initialStateU = JSON.parse(
    //   fs.readFileSync(`${integrationsPrefux}u/initial-state.json`, 'utf8')
    // );
    const initialStateFactMarket = JSON.parse(
      fs.readFileSync(
        `${integrationsPrefux}fact-market/dist/initial-state.json`,
        'utf8'
      )
    );

    // // Deploy contracts
    // contractU = await warp.deploy({
    //   wallet: new ArweaveSigner(jwk),
    //   initState: JSON.stringify({
    //     ...initialStateU,
    //   }),
    //   src: contractSrcU,
    // });

    // contractFactsToken = await warp.deploy({
    //   wallet: new ArweaveSigner(jwk),
    //   initState: JSON.stringify({
    //     ...initialStateFactsToken,
    //     u: TEST_U_TX,
    //   }),
    //   src: contractSrcFactsToken,
    //   evaluationManifest: {
    //     evaluationOptions: {
    //       sourceType: SourceType.BOTH,
    //       internalWrites: true,
    //       allowBigInt: true,
    //       unsafeClient: 'skip',
    //     },
    //   },
    // });

    contractFactMarket = await warp.deploy({
      wallet: new ArweaveSigner(jwk),
      initState: JSON.stringify({
        ...initialStateFactMarket,
        pair: TEST_U_TX,
        position: 'support',
      }),
      src: contractSrcFactMarket.replace('<FACTS_CONTRACT_ID>', TEST_FACTS_TX),
      evaluationManifest: {
        evaluationOptions: {
          sourceType: SourceType.BOTH,
          internalWrites: true,
          allowBigInt: true,
          unsafeClient: 'skip',
        },
      },
    });

    // console.log('contractU', contractU.contractTxId);
    // console.log('contractFactsToken', contractFactsToken.contractTxId);
    console.log('contractFactMarket', contractFactMarket.contractTxId);

    // Connect wallet to contracts
    connectedWallet1U = warp
      .contract(TEST_U_TX)
      .setEvaluationOptions({
        remoteStateSyncSource: `https://dre-5.warp.cc/contract`,
        remoteStateSyncEnabled: true,
        internalWrites: true,
        allowBigInt: true,
        unsafeClient: 'skip',
      })
      .connect(jwk);
    connectedWallet1FactsToken = warp
      .contract(TEST_FACTS_TX)
      .setEvaluationOptions({
        remoteStateSyncSource: `https://dre-5.warp.cc/contract`,
        remoteStateSyncEnabled: true,
        internalWrites: true,
        allowBigInt: true,
        unsafeClient: 'skip',
      })
      .connect(jwk);
  }

  connectedWallet1FactMarket = warp
    .contract(contractFactMarket.contractTxId)
    .setEvaluationOptions({
      remoteStateSyncSource: `https://dre-5.warp.cc/contract`,
      remoteStateSyncEnabled: true,
      internalWrites: true,
      allowBigInt: true,
      unsafeClient: 'skip',
    })
    .connect(jwk);

  // Mint AR to wallets
  // await fetch(`http://localhost:1984/mint/${wallet1.address}/100000000000000`);
  // await fetch(`http://localhost:1984/mint/${wallet2.address}/100000000000000`);
});
/**
 * 1. allow to fact market
 * 2. buy on fact market
 * 3. log state of U token in Facts Token
 */

test.skip('should get price on fact market', async () => {
  const output = await warp
    .contract('GBYW1o8Nh4rrbw5WSueEjA44f9Re09Vki06E7X_mzAw')
    .setEvaluationOptions({
      remoteStateSyncSource: `https://dre-5.warp.cc/contract`,
      remoteStateSyncEnabled: true,
      internalWrites: true,
      allowBigInt: true,
      unsafeClient: 'skip',
    })
    .viewState({ function: 'get-price', position: 'support', qty: '1' });
  assert.is(
    output?.result?.factMarket,
    'GBYW1o8Nh4rrbw5WSueEjA44f9Re09Vki06E7X_mzAw'
  );
});

test.skip('should get supply on fact market', async () => {
  const output = await warp
    .contract('GBYW1o8Nh4rrbw5WSueEjA44f9Re09Vki06E7X_mzAw')
    .setEvaluationOptions({
      remoteStateSyncSource: `https://dre-5.warp.cc/contract`,
      remoteStateSyncEnabled: true,
      internalWrites: true,
      allowBigInt: true,
      unsafeClient: 'skip',
    })
    .viewState({ function: 'get-supply' });

  console.log(output);
  assert.is(!output?.result?.total, false);
});

test('should allow 105 sub units to the Facts Token contract', async () => {
  const interaction = await connectedWallet1U.writeInteraction({
    function: 'allow',
    // VqVFBydoDYKFzQsmejLTPrk67BShXgD25BdDDjIrKwA
    target: contractFactMarket.contractTxId,
    qty: 2,
  });

  const state = (await connectedWallet1U.readState()).cachedValue.state;
  allowTxForClaim1 = interaction.originalTxId;
  assert.is(
    state.claimable.map((c) => c.txID).includes(allowTxForClaim1),
    true
  );
});

test('should buy 1 position token', async () => {
  const interaction = await connectedWallet1FactMarket.writeInteraction({
    function: 'buy',
    qty: 1,
    price: 1,
    fee: 1,
    tx: allowTxForClaim1,
    position: 'support',
  });
  const state = (await connectedWallet1FactsToken.readState()).cachedValue
    .state;
  assert.is(state.balances[wallet1.address], 1);
});

test('should sell 1 position token', async () => {
  const uStateBefore = (await connectedWallet1U.readState()).cachedValue.state;
  const beforeBalance =
    uStateBefore.balances['9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4'];
  await connectedWallet1FactMarket.writeInteraction({
    function: 'sell',
    qty: 1,
    position: 'support',
  });

  const uStateAfter = (await connectedWallet1U.readState()).cachedValue.state;
  const afterBalance =
    uStateAfter.balances['9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4'];

  assert.is(beforeBalance, afterBalance - 2);
});

test.after(async () => {
  // await arlocal.stop();
});

test.run();
