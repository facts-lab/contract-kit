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

test('should throw (positionType must be support or oppose.) if wrong', () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';

  sell(env)(
    {
      ticker: 'FACTMKT',
      name: '',
      balances: {},
      settings: [
        ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
        ['isTradeable', true],
      ],
    },
    { caller, input: { positionType: 'suppor' } }
  ).catch((e) => {
    assert.equal(e.message, 'positionType must be support or oppose.');
  });
});

test('should throw (qty must be an integer greater than zero.) if undefined', async () => {
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
    { caller, input: { positionType: 'support' } }
  ).catch((e) => {
    assert.equal(e.message, 'qty must be an integer greater than zero.');
  });
});

test('should throw (qty must be an integer greater than zero.) if less than 0', async () => {
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
    { caller, input: { positionType: 'support', qty: 0.1 } }
  ).catch((e) => {
    assert.equal(e.message, 'qty must be an integer greater than zero.');
  });
});

test('should throw (qty must be an integer greater than zero.) if string', async () => {
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
    { caller, input: { positionType: 'support', qty: '0.1' } }
  ).catch((e) => {
    assert.equal(e.message, 'qty must be an integer greater than zero.');
  });
});

test('should throw (Incorrect price.)', async () => {
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
      balances: {
        '<justin>': 1,
        '<jshaw>': 99,
      },
      oppositionBalances: {},
      pair: '',
      settings: [
        ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
        ['isTradeable', true],
      ],
    },
    {
      caller,
      input: {
        positionType: 'support',
        expected: 98,
        qty: 1,
      },
    }
  ).catch((e) => {
    assert.equal(e.message, 'The price has changed.');
  });
});

test('should throw (Incorrect fee.)', async () => {
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
      balances: {
        '<jshaw>': 99,
        '<justin>': 1,
      },
      oppositionBalances: {},
      pair: '',
      settings: [
        ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
        ['isTradeable', true],
      ],
    },
    {
      caller,
      input: {
        positionType: 'support',
        qty: 1,
        price: 100,
        fee: 4,
        txId: '<txId>',
      },
    }
  ).catch((e) => {
    assert.equal(e.message, 'The price has changed.');
  });
});

test('should throw (Error: An error occurred while claiming the pair.) if claim doesnt work.', async () => {
  const env = setupSmartWeaveEnv({ write: false });
  const caller = '<justin>';
  const txId = '<txId>';
  const pair = '<pair>';
  await sell(env)(
    {
      ticker: 'FACTMKT',
      title: '',
      registry: '',
      creator: '',
      position: 'support',
      creator_cut: 0,
      balances: {
        '<jshaw>': 99,
      },
      oppositionBalances: {},
      pair,
      settings: [
        ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
        ['isTradeable', true],
      ],
    },
    {
      caller,
      input: {
        positionType: 'support',
        qty: 1,
        price: 100,
        fee: 5,
        txId,
      },
    }
  ).catch((e) => {
    assert.equal(e.message, 'Caller balance too low.');
  });
});

test('should sell 1 support token for 100 base units with a fee of 5 base units', async () => {
  const env = setupSmartWeaveEnv({ write: true });
  const caller = '<justin>';
  const txId = '<txId>';
  const pair = '<pair>';
  const output = await sell(env)(
    {
      ticker: 'FACTMKT',
      title: '',
      registry: '',
      creator: '',
      position: 'support',
      creator_cut: 0,
      balances: {
        '<jshaw>': 99,
        '<justin>': 1,
      },
      oppositionBalances: {},
      pair,
      settings: [
        ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
        ['isTradeable', true],
      ],
    },
    {
      caller,
      input: {
        positionType: 'support',
        expected: 99,
        qty: 1,
      },
    }
  );
  const { state } = output;

  assert.is(state.creator_cut, 0);
  assert.is(state.balances[caller], 0);
});

test('should distribute to creator', async () => {
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
      creator_cut: 50000,
      balances: {
        '<jshaw>': 99,
        '<justin>': 1,
      },
      oppositionBalances: {},
      pair,
      settings: [
        ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
        ['isTradeable', true],
      ],
    },
    {
      caller,
      input: {
        positionType: 'support',
        expected: 99,
        qty: 1,
      },
    }
  );
  const { state } = output;

  assert.is(state.creator_cut, 0);
  assert.is(state.balances[caller], 0);
  assert.is(env?.balances()['test'], 50000);
});

test('should not distribute to creator', async () => {
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
      oppositionBalances: {},
      pair,
      settings: [
        ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
        ['isTradeable', true],
      ],
    },
    {
      caller,
      input: {
        positionType: 'support',
        expected: 99,
        qty: 1,
      },
    }
  );
  const { state } = output;

  assert.is(state.creator_cut, 49000);
  assert.is(state.balances[caller], 0);
  assert.is(env?.balances()['test'], undefined);
});

test.run();
