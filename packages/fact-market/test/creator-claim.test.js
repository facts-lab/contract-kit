import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { creatorClaim } from '../src/write/creator-claim.js';
import { setupSmartWeaveEnv } from './setup.js';

const test = suite('creator-claim');

test('should throw (Only the creator can call this function.)', async () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';

  try {
    await creatorClaim(env)(
      {
        ticker: 'FACTMKT',
        title: '',
        creator: '<tom>',
        position: '',
        creator_cut: 0,
        balances: {},
        oppositionBalances: {},
        pair: '',
        settings: [],
      },
      { caller }
    );
  } catch (e) {
    assert.is(e.message, 'Only the creator can call this function.');
  }
});

test('should throw (Caller does not have anything to claim.)', async () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';
  try {
    await creatorClaim(env)(
      {
        ticker: 'FACTMKT',
        title: '',
        creator: '<justin>',
        position: '',
        creator_cut: 0,
        balances: {},
        oppositionBalances: {},
        pair: '',
        settings: [],
      },
      { caller }
    );
  } catch (e) {
    assert.is(e.message, 'Caller does not have anything to claim.');
  }
});

test('should throw (Caller does not have anything to claim.)', async () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';
  try {
    creatorClaim(env)(
      {
        ticker: 'FACTMKT',
        title: '',
        creator: '<tom>',
        position: '',
        creator_cut: 0,
        balances: {},
        oppositionBalances: {},
        pair: '',
        settings: [],
      },
      { caller }
    );
  } catch (e) {
    assert.is(e.message, 'Only the creator can call this function.');
  }
});

test('should throw (Caller does not have anything to claim.)', async () => {
  const env = setupSmartWeaveEnv({ write: false });
  const caller = '<justin>';

  try {
    await creatorClaim(env)(
      {
        ticker: 'FACTMKT',
        title: '',
        creator: caller,
        position: '',
        creator_cut: 1,
        balances: {},
        oppositionBalances: {},
        pair: '',
        settings: [],
      },
      { caller }
    );
  } catch (e) {
    assert.is(
      e.message,
      'Error: There was an error calling the function on the state.pair contract.'
    );
  }
});

test('should distribute.', async () => {
  const env = setupSmartWeaveEnv({ write: true });
  const caller = '<justin>';
  const tx = '<test-tx>';
  const pair = '<pair>';

  const output = await creatorClaim(env)(
    {
      ticker: 'FACTMKT',
      title: '',
      creator: '<justin>',
      position: 'oppose',
      creator_cut: 1,
      balances: {},
      oppositionBalances: {
        '<jshaw>': 99,
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

  const { state } = output;
  assert.is(env.balances()[caller], 1);
  assert.is(state.creator_cut, 0);
});

test.run();
