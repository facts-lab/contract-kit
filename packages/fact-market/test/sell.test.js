import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { sell } from '../src/write/sell.js';
import { setupSmartWeaveEnv } from './setup.js';

const test = suite('sell');

test('should throw (position must be support or oppose.) if undefined', async () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';
  try {
    await sell(env)(
      {
        ticker: 'FACTMKT',
        title: '',
        registry: '',
        creator: '',
        position: '',
        creator_cut: 0,
        balances: {},
        oppose: {},
        pair: '',
        settings: [
          ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
          ['isTradeable', true],
        ],
      },
      { caller, input: {} }
    );
    assert.unreachable();
  } catch (error) {
    assert.is(error.message, 'position must be support or oppose.');
  }
});

test('should throw (position must be support or oppose.) if wrong', async () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';
  try {
    await sell(env)(
      {
        ticker: 'FACTMKT',
        title: '',
        registry: '',
        creator: '',
        position: '',
        creator_cut: 0,
        balances: {},
        oppose: {},
        pair: '',
        settings: [
          ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
          ['isTradeable', true],
        ],
      },
      { caller, input: { position: 'suppor' } }
    );
    assert.unreachable();
  } catch (error) {
    assert.is(error.message, 'position must be support or oppose.');
  }
});

test('should throw (qty must be an integer greater than zero.) if undefined', async () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';
  try {
    await sell(env)(
      {
        ticker: 'FACTMKT',
        title: '',
        registry: '',
        creator: '',
        position: '',
        creator_cut: 0,
        balances: {},
        oppose: {},
        pair: '',
        settings: [
          ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
          ['isTradeable', true],
        ],
      },
      { caller, input: { position: 'support' } }
    );
    assert.unreachable();
  } catch (error) {
    assert.is(error.message, 'qty must be an integer greater than zero.');
  }
});

test('should throw (qty must be an integer greater than zero.) if less than 0', async () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';
  try {
    await sell(env)(
      {
        ticker: 'FACTMKT',
        title: '',
        registry: '',
        creator: '',
        position: '',
        creator_cut: 0,
        balances: {},
        oppose: {},
        pair: '',
        settings: [
          ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
          ['isTradeable', true],
        ],
      },
      { caller, input: { position: 'support', qty: 0.1 } }
    );
    assert.unreachable();
  } catch (error) {
    assert.is(error.message, 'qty must be an integer greater than zero.');
  }
});

test('should throw (qty must be an integer greater than zero.) if string', async () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';
  try {
    await sell(env)(
      {
        ticker: 'FACTMKT',
        title: '',
        registry: '',
        creator: '',
        position: '',
        creator_cut: 0,
        balances: {},
        oppose: {},
        pair: '',
        settings: [
          ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
          ['isTradeable', true],
        ],
      },
      { caller, input: { position: 'support', qty: '0.1' } }
    );
    assert.unreachable();
  } catch (error) {
    assert.is(error.message, 'qty must be an integer greater than zero.');
  }
});

test('should throw (Caller expected a different amount.)', async () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';
  try {
    await sell(env)(
      {
        ticker: 'FACTMKT',
        title: '',
        registry: '',
        creator: '',
        position: '',
        creator_cut: 0,
        balances: {
          '<justin>': 1,
          '<jshaw>': 99,
        },
        oppose: {},
        pair: '',
        settings: [
          ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
          ['isTradeable', true],
        ],
      },
      {
        caller,
        input: {
          position: 'support',
          expected: 98,
          qty: 1,
        },
      }
    );
    assert.unreachable();
  } catch (error) {
    assert.is(error.message, 'Caller expected a different amount.');
  }
});

test('should throw (Caller balance too low.)', async () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';
  try {
    await sell(env)(
      {
        ticker: 'FACTMKT',
        title: '',
        registry: '',
        creator: '',
        position: '',
        creator_cut: 0,
        balances: {
          '<justin>': 0,
          '<jshaw>': 99,
        },
        oppose: {},
        pair: '',
        settings: [
          ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
          ['isTradeable', true],
        ],
      },
      {
        caller,
        input: {
          position: 'support',
          qty: 1,
        },
      }
    );
  } catch (error) {
    assert.is(error.message, 'Caller balance too low.');
  }
});

test('should sell 1 support token for 100 base units', async () => {
  const env = setupSmartWeaveEnv({ write: true });
  const caller = '<justin>';
  const creator = 'test';
  const txId = '<txId>';
  const pair = '<pair>';
  const output = await sell(env)(
    {
      ticker: 'FACTMKT',
      title: '',
      registry: '',
      creator,
      position: 'support',
      creator_cut: 49000,
      balances: {
        '<jshaw>': 99,
        '<justin>': 1,
      },
      oppose: {},
      pair,
      settings: [
        ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
        ['isTradeable', true],
      ],
    },
    {
      caller,
      input: {
        position: 'support',
        expected: 100,
        qty: 1,
      },
    }
  );

  const { state } = output;

  assert.is(state.balances[caller], 0);
});

test('should sell 1 oppose token for 1 base units', async () => {
  const env = setupSmartWeaveEnv({ write: true });
  const caller = '<justin>';
  const creator = 'test';
  const txId = '<txId>';
  const pair = '<pair>';
  const output = await sell(env)(
    {
      ticker: 'FACTMKT',
      title: '',
      registry: '',
      creator,
      position: 'support',
      creator_cut: 49000,
      balances: {
        '<jshaw>': 99,
      },
      oppose: {
        '<justin>': 1,
      },
      pair,
      settings: [
        ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
        ['isTradeable', true],
      ],
    },
    {
      caller,
      input: {
        position: 'oppose',
        expected: 1,
        qty: 1,
      },
    }
  );

  const { state } = output;

  assert.is(state.oppose[caller], 0);
});

test.run();
