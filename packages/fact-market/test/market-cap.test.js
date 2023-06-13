import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { getOppositionCap } from '../src/read/get-opposition-cap.js';
import { getSupportCap } from '../src/read/get-support-cap.js';
import { getTotalCap } from '../src/read/get-total-cap.js';
import { setupSmartWeaveEnv } from './setup.js';

const test = suite('market-cap');

test('should get support cap.', async () => {
  const env = setupSmartWeaveEnv({ write: true });
  const caller = '<justin>';
  const tx = '<test-tx>';
  const pair = '<pair>';

  const output = await getSupportCap(
    {
      ticker: 'FACTMKT',
      title: '',
      creator: '<justin>',
      position: 'oppose',
      creator_cut: 1,
      oppositionBalances: {},
      balances: {
        '<jshaw0>': 100,
        '<jshaw1>': 100,
        '<jshaw2>': 100,
        '<jshaw3>': 100,
        '<jshaw4>': 100,
        '<jshaw5>': 100,
      },
      pair,
      settings: [
        ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
        ['isTradeable', true],
      ],
    },
    {
      caller,
    }
  );

  const { result } = output;
  assert.is(result.cap, 600);
});

test('should get opposition cap.', async () => {
  const env = setupSmartWeaveEnv({ write: true });
  const caller = '<justin>';
  const tx = '<test-tx>';
  const pair = '<pair>';

  const output = await getOppositionCap(
    {
      ticker: 'FACTMKT',
      title: '',
      creator: '<justin>',
      position: 'oppose',
      creator_cut: 1,
      oppositionBalances: {
        '<jshaw0>': 100,
        '<jshaw1>': 100,
        '<jshaw2>': 100,
        '<jshaw3>': 100,
        '<jshaw4>': 100,
        '<jshaw5>': 100,
      },
      balances: {
        '<jshaw0>': 100,
        '<jshaw1>': 100,
        '<jshaw2>': 100,
        '<jshaw3>': 100,
        '<jshaw4>': 100,
        '<jshaw5>': 100,
      },
      pair,
      settings: [
        ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
        ['isTradeable', true],
      ],
    },
    {
      caller,
    }
  );

  const { result } = output;
  assert.is(result.cap, 600);
});

test('should get total cap.', async () => {
  const env = setupSmartWeaveEnv({ write: true });
  const caller = '<justin>';
  const tx = '<test-tx>';
  const pair = '<pair>';

  const output = await getTotalCap(
    {
      ticker: 'FACTMKT',
      title: '',
      creator: '<justin>',
      position: 'oppose',
      creator_cut: 1,
      oppositionBalances: {
        '<jshaw0>': 100,
        '<jshaw1>': 100,
        '<jshaw2>': 100,
        '<jshaw3>': 100,
        '<jshaw4>': 100,
        '<jshaw5>': 100,
      },
      balances: {
        '<jshaw0>': 100,
        '<jshaw1>': 100,
        '<jshaw2>': 100,
        '<jshaw3>': 100,
        '<jshaw4>': 100,
        '<jshaw5>': 100,
      },
      pair,
      settings: [
        ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
        ['isTradeable', true],
      ],
    },
    {
      caller,
    }
  );

  const { result } = output;
  assert.is(result.cap, 1200);
});

test.run();
