import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { WarpFactory, LoggerFactory, SourceType } from 'warp-contracts/mjs';
import { DeployPlugin, ArweaveSigner } from 'warp-contracts-plugin-deploy';
import ArLocal from 'arlocal';
import * as fs from 'fs';
import { toPairs } from 'ramda';

// What am I testing?
/**
 * 1. Deploy U token
 * 2. Deploy Facts Token with U in state
 * 3. Deploy Fact Market with U pair and Facts Token in register function
 * 4. Run buy on facts token and log state of U in the Facts Token
 */

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
const test = suite('full-integration-prod');

test.before(async () => {
  const jwk = JSON.parse(
    fs.readFileSync(process.env.PATH_TO_WALLET).toString()
  );

  LoggerFactory.INST.logLevel('error');
  warp = WarpFactory.forMainnet().use(new DeployPlugin());

  // Grab the contract and initial state
  const prefix = `./dist/`;
  const integrationsPrefux = `./contract-integrations/`;
  const contractSrcFactsToken = fs.readFileSync(`${prefix}contract.js`, 'utf8');
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

  contractFactsToken = await warp.deploy({
    wallet: new ArweaveSigner(jwk),
    initState: JSON.stringify({
      ...initialStateFactsToken,
      u: TEST_U_TX,
    }),
    src: contractSrcFactsToken,
    evaluationManifest: {
      evaluationOptions: {
        sourceType: SourceType.BOTH,
        internalWrites: true,
        allowBigInt: true,
        unsafeClient: 'skip',
      },
    },
  });

  contractFactMarket = await warp.deploy({
    wallet: new ArweaveSigner(jwk),
    initState: JSON.stringify({
      ...initialStateFactMarket,
      position: 'support',
    }),
    src: contractSrcFactMarket.replace(
      '<FACTS_CONTRACT_ID>',
      contractFactsToken.contractTxId
    ),
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
  console.log('contractFactsToken', contractFactsToken.contractTxId);
  console.log('contractFactMarket', contractFactMarket.contractTxId);

  // Connect wallet to contracts
  connectedWallet1U = warp
    .contract(TEST_U_TX)
    .setEvaluationOptions({
      remoteStateSyncSource: `https://dre-1.warp.cc/contract`,
      remoteStateSyncEnabled: true,
      internalWrites: true,
      allowBigInt: true,
      unsafeClient: 'skip',
    })
    .connect(jwk);
  connectedWallet1FactsToken = warp
    .contract(contractFactsToken.contractTxId)
    .setEvaluationOptions({
      remoteStateSyncSource: `https://dre-1.warp.cc/contract`,
      remoteStateSyncEnabled: true,
      internalWrites: true,
      allowBigInt: true,
      unsafeClient: 'skip',
    })
    .connect(jwk);
  // connectedWallet1FactMarket = warp
  //   .contract(contractFactMarket.contractTxId)
  //   .setEvaluationOptions({
  //     internalWrites: true,
  //     mineArLocalBlocks: true,
  //     unsafeClient: 'skip',
  //   })
  //   .connect(wallet1.jwk);

  // Mint AR to wallets
  // await fetch(`http://localhost:1984/mint/${wallet1.address}/100000000000000`);
  // await fetch(`http://localhost:1984/mint/${wallet2.address}/100000000000000`);
});
/**
 * 1. allow to fact market
 * 2. buy on fact market
 * 3. log state of U token in Facts Token
 */

test('should get support price on fact market', async () => {
  const getPriceOutput = await warp
    .contract('cDKMaop1mEq6SDJFV_wfKZb-dRz3U_IZwtAmMND-TE0')
    .setEvaluationOptions({
      remoteStateSyncSource: `https://dre-6.warp.cc/contract`,
      remoteStateSyncEnabled: true,
      internalWrites: true,
      allowBigInt: true,
      unsafeClient: 'skip',
    })
    .viewState({ function: 'get-price', position: 'support', qty: '1' });
  console.log(getPriceOutput);
});

test.skip('should allow 105 sub units to the Facts Token contract', async () => {
  const interaction = await connectedWallet1U.writeInteraction({
    function: 'allow',
    // VqVFBydoDYKFzQsmejLTPrk67BShXgD25BdDDjIrKwA
    target: contractFactsToken.contractTxId,
    qty: 2,
  });

  const state = (await connectedWallet1U.readState()).cachedValue.state;
  allowTxForClaim1 = interaction.originalTxId;
  assert.is(
    state.claimable.map((c) => c.txID).includes(allowTxForClaim1),
    true
  );
});

test.skip('should buy 1 position token', async () => {
  const interaction = await connectedWallet1FactsToken.writeInteraction({
    function: 'buy',
    qty: 1,
    price: 1,
    fee: 1,
    tx: allowTxForClaim1,
    position: 'support',
    // W6uq60Hx9YL0n99zLKB0PCEVCJGkQMgcMayit3-8Ass
    factMarket: contractFactMarket.contractTxId,
    owner: {
      addr: '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4',
      position: 'support',
    },
  });

  // const u_state = (await connectedWallet1U.readState()).cachedValue.state;
  // assert.is(
  //   u_state.claimable.map((c) => c.txID).includes(allowTxForClaim1),
  //   false
  // );
  // const state = (await connectedWallet1FactsToken.readState()).cachedValue
  //   .state;
  // console.log('STATE', state);
  // assert.is(state.balances[wallet1.address], 1);
});

test.skip('should allow 105 sub units to the Facts Token contract', async () => {
  const interaction = await connectedWallet1U.writeInteraction({
    function: 'allow',
    target: contractFactsToken.contractTxId,
    qty: 2,
  });

  const state = (await connectedWallet1U.readState()).cachedValue.state;
  allowTxForClaim2 = interaction.originalTxId;
  assert.is(
    state.claimable.map((c) => c.txID).includes(allowTxForClaim2),
    true
  );
});

test.skip('should reject transfer', async () => {
  const interaction = await connectedWallet1FactsToken.writeInteraction({
    function: 'buy',
    qty: 1,
    price: 1,
    fee: 5,
    tx: allowTxForClaim2,
    position: 'support',
    // f4ut1745jCDx3FoxabkeffHmqY1e0P5OIR78cIv3dBk
    factMarket: contractFactMarket.contractTxId,
    owner: {
      addr: '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4',
      position: 'support',
    },
  });

  // const u_state = (await connectedWallet1U.readState()).cachedValue.state;
  // assert.is(
  //   u_state.claimable.map((c) => c.txID).includes(allowTxForClaim1),
  //   false
  // );
  // const state = (await connectedWallet1FactsToken.readState()).cachedValue
  //   .state;
  // console.log('STATE', state);
  // assert.is(state.balances[wallet1.address], 1);
});

// test('should allow 105 sub units to the Facts Token contract', async () => {
//   const interaction = await connectedWallet1U.writeInteraction({
//     function: 'allow',
//     target: contractFactsToken.contractTxId,
//     qty: 2,
//   });

//   const state = (await connectedWallet1U.readState()).cachedValue.state;
//   allowTxForClaim2 = interaction.originalTxId;
//   assert.is(
//     state.claimable.map((c) => c.txID).includes(allowTxForClaim2),
//     true
//   );
// });

// test('should buy 1 position token', async () => {
//   const interaction = await connectedWallet1FactsToken.writeInteraction({
//     function: 'buy',
//     qty: 1,
//     price: 2,
//     fee: 1,
//     tx: allowTxForClaim2,
//     position: 'support',
//     factMarket: contractFactMarket.contractTxId,
//     owner: {
//       addr: '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4',
//       position: 'support',
//     },
//   });

//   console.log('Interaction', interaction);
//   const u_state = (await connectedWallet1U.readState()).cachedValue.state;
//   assert.is(
//     u_state.claimable.map((c) => c.txID).includes(allowTxForClaim2),
//     false
//   );
//   const state = (await connectedWallet1FactsToken.readState()).cachedValue
//     .state;
//   // console.log('STATE', state);
//   // assert.is(state.balances[wallet1.address], 1);
// });
// test('transfer 5 to wallet 2', async () => {
//   await connectedWallet1SEQ.writeInteraction({
//     function: 'transfer',
//     target: wallet2.address,
//     qty: 5000000,
//   });
//   const state = (await connectedWallet1SEQ.readState()).cachedValue.state;
//   assert.is(state.balances[wallet2.address], 5000000);
// });

// test('allow 2 with wallet 2 (to wallet 1) - allow 1 with wallet 2', async () => {
//   const interaction = await connectedWallet2SEQ.writeInteraction({
//     function: 'allow',
//     target: wallet1.address,
//     qty: 2000000,
//   });

//   const interaction2 = await connectedWallet2SEQ.writeInteraction({
//     function: 'allow',
//     target: wallet1.address,
//     qty: 1000000,
//   });

//   const state = (await connectedWallet1SEQ.readState()).cachedValue.state;
//   assert.is(state.claimable.length, 2);
//   // Set the allow tx for claim next
//   allowTxForClaim1 = interaction.originalTxId;
//   allowTxForClaim2 = interaction2.originalTxId;
// });

// test('claim 2 with wallet 1', async () => {
//   await connectedWallet1SEQ.writeInteraction({
//     function: 'claim',
//     txID: allowTxForClaim1,
//     qty: 2000000,
//   });
//   const state = (await connectedWallet1SEQ.readState()).cachedValue.state;

//   assert.is(state.balances[wallet1.address], 7000000);
//   assert.is(state.balances[wallet2.address], 2000000);
// });

// test('should claim with different txID', async () => {
//   await connectedWallet1SEQ.writeInteraction({
//     function: 'claim',
//     txID: allowTxForClaim2,
//     qty: 1000000,
//   });
//   const state = (await connectedWallet1SEQ.readState()).cachedValue.state;
//   assert.is(state.balances[wallet1.address], 8000000);
//   assert.is(state.balances[wallet2.address], 2000000);
// });

// test('check balance with target', async () => {
//   const interaction = await connectedWallet1SEQ.viewState({
//     function: 'balance',
//     target: wallet2.address,
//   });

//   assert.is(interaction.result.balance, 2000000);
// });

// test('check balance without target', async () => {
//   const interaction = await connectedWallet1SEQ.viewState({
//     function: 'balance',
//   });
//   assert.is(interaction.result.balance, 8000000);
// });

test.after(async () => {
  // await arlocal.stop();
});

test.run();
