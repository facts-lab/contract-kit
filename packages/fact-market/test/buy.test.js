import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { buy } from '../src/write/buy.js';
import { setupSmartWeaveEnv } from './setup.js';

const test = suite('buy');

test('should throw (positionType must be support or oppose.) if undefined', () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';

  buy(env)(
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

  buy(env)(
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

  buy(env)(
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

  buy(env)(
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

  buy(env)(
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

  buy(env)(
    {
      ticker: 'FACTMKT',
      title: '',
      registry: '',
      creator: '',
      position: '',
      creator_cut: 0,
      balances: {
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
        qty: 1,
        price: 99,
        fee: 5,
        tx: '<tx>',
      },
    }
  ).catch((e) => {
    assert.equal(e.message, 'Incorrect price.');
  });
});
test('should throw (Incorrect fee.)', async () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';

  buy(env)(
    {
      ticker: 'FACTMKT',
      title: '',
      registry: '',
      creator: '',
      position: '',
      creator_cut: 0,
      balances: {
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
        qty: 1,
        price: 100,
        fee: 4,
        tx: '<tx>',
      },
    }
  ).catch((e) => {
    assert.equal(e.message, 'Incorrect fee.');
  });
});

test('should throw (Error: An error occurred while claiming the pair.) if claim doesnt work.', async () => {
  const env = setupSmartWeaveEnv({ write: false });
  const caller = '<justin>';
  const tx = '<tx>';
  const pair = '<pair>';
  await buy(env)(
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
        tx,
      },
    }
  ).catch((e) => {
    assert.equal(
      e.message,
      'Error: An error occurred while claiming the pair.'
    );
  });
});

test('should throw (tx is required)', async () => {
  const env = setupSmartWeaveEnv({ write: true });
  const caller = '<justin>';
  const tx = '<tx>';
  const pair = '<pair>';
  const output = await buy(env)(
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
      },
    }
  ).catch((e) => {
    assert.equal(e.message, 'tx is required.');
  });
});

test('should buy 1 support token for 100 base units with a fee of 5 base units', async () => {
  const env = setupSmartWeaveEnv({ write: true });
  const caller = '<justin>';
  const tx = '<tx>';
  const pair = '<pair>';
  const output = await buy(env)(
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
        tx,
      },
    }
  );
  const { state } = output;
  assert.is(state.creator_cut, 5);
  assert.is(state.balances[caller], 1);
});

test('should buy 1 oppose token for 100 base units with a fee of 5 base units', async () => {
  const env = setupSmartWeaveEnv({ write: true });
  const caller = '<justin>';
  const tx = '<tx>';
  const pair = '<pair>';
  const output = await buy(env)(
    {
      ticker: 'FACTMKT',
      title: '',
      registry: '',
      creator: '',
      position: 'oppose',
      creator_cut: 0,
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
      input: {
        positionType: 'oppose',
        qty: 1,
        price: 100,
        fee: 5,
        tx,
      },
    }
  );
  const { state } = output;
  assert.is(state.creator_cut, 5);
  assert.is(state.oppositionBalances[caller], 1);
});

test('should buy 2 support token for 200 base units with a fee of 10 base units', async () => {
  const env = setupSmartWeaveEnv({ write: true });
  const caller = '<justin>';
  const tx = '<tx>';
  const pair = '<pair>';
  const output = await buy(env)(
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
        qty: 2,
        price: 200,
        fee: 10,
        tx,
      },
    }
  );
  const { state } = output;
  assert.is(env.claimed()[0], tx);
  assert.is(env.registered()[0], env.transaction.id);
  assert.is(state.creator_cut, 10);
  assert.is(state.balances[caller], 2);
});

test('should return the previous state because of the FCP error.', async () => {
  const env = setupSmartWeaveEnv({ write: false });
  const caller = '<justin>';
  const tx = '<test-tx>';
  const pair = '<pair>';
  const output = await buy(env)(
    {
      ticker: 'FACTMKT',
      title: '',
      registry: '',
      creator: '',
      position: 'oppose',
      creator_cut: 0,
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
      input: {
        positionType: 'oppose',
        qty: 2,
        price: 200,
        fee: 10,
        tx,
      },
    }
  );

  const { state } = output;
  assert.is(env.rejected()[0], tx);
  assert.is(state.creator_cut, 0);
  assert.is(state.oppositionBalances[caller], undefined);
});

test.run();
