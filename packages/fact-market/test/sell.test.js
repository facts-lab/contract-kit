import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { sell } from '../src/write/sell.js';
import { setupSmartWeaveEnv } from './setup.js';

const test = suite('sell');

test('should throw (positionType must be support or oppose.) if undefined', () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';

  sell(env)(
    {
      ticker: 'FACTMKT',
      title: '',
      registry: '',
      creator: '',
      position: '',
      creator_cut: 0,
      balances: {},
      oppositionBalances: {},
      pair: '',
      settings: [
        ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
        ['isTradeable', true],
      ],
    },
    { caller, input: {} }
  ).catch((e) => {
    assert.equal(e.message, 'positionType must be support or oppose.');
  });
});

test.run();
