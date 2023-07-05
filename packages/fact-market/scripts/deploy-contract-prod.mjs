import { WarpFactory, SourceType } from 'warp-contracts';
import { DeployPlugin, ArweaveSigner } from 'warp-contracts-plugin-deploy';

import fs from 'fs';

async function deploy(folder) {
  const jwk = JSON.parse(
    fs.readFileSync(process.env.PATH_TO_WALLET).toString()
  );
  const warp = WarpFactory.forMainnet().use(new DeployPlugin());
  const contractSrc = fs.readFileSync(`${folder}/contract.js`, 'utf8');
  const stateFromFile = JSON.parse(
    fs.readFileSync(`${folder}/initial-state.json`, 'utf8')
  );
  if (!process.env.WALLET_ADDRESS) {
    console.error(
      'Set proces.env.WALLET_ADDRESS to your wallet addres. eg. 9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4'
    );
    process.exit(1);
  }
  const initialState = {
    ...stateFromFile,
    owner: process.env.WALLET_ADDRESS,
    ticker: 'FACTMKT',
    title: 'Deploy contracts from this source.',
    position: 'support',
    creator_cut: 0,
    burn: 0,
    balances: {},
    oppose: {},
    pair: 'KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw', //1232330 dre3
    register: false,
  };

  const deploySource = await warp.deploy({
    wallet: new ArweaveSigner(jwk),
    initState: JSON.stringify(initialState),
    src: contractSrc,
    evaluationManifest: {
      evaluationOptions: {
        sourceType: SourceType.BOTH,
        internalWrites: true,
        allowBigInt: true,
        unsafeClient: 'skip',
      },
    },
  });
  console.log(`source contractTxId ${deploySource.srcTxId}`);

  const deployMarket = await warp.deployFromSourceTx({
    wallet: new ArweaveSigner(jwk),
    srcTxId: deploySource.srcTxId,
    initState: JSON.stringify({ ...initialState, title: 'First Fact Market' }),
    evaluationManifest: {
      evaluationOptions: {
        sourceType: SourceType.BOTH,
        internalWrites: true,
        allowBigInt: true,
        unsafeClient: 'skip',
      },
    },
  });

  console.log(`Fact Market contractTxId ${deployMarket.contractTxId}`);
}
deploy(process.argv[2]).catch(console.log);
