import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { buy } from '../src/write/buy.js';
import { setupSmartWeaveEnv } from './setup.js';

const test = suite('buy');

test('should throw (position must be support or oppose.) if undefined', () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';
  assert.throws(
    () =>
      buy(env)(
        {
          ticker: 'FACTMKT',
          title: '',
          registry: '',
          creator: '',
          position: '',
          balances: {},
          oppose: {},
          pair: '',
          settings: [
            ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
            ['isTradeable', true],
          ],
        },
        { caller, input: {} }
      ),
    /position must be support or oppose./
  );
});

test('should throw (position must be support or oppose.) if wrong', () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';

  assert.throws(
    () =>
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
        { caller, input: { position: 'suppor' } }
      ),
    /position must be support or oppose./
  );
});

test('should throw (qty must be an integer greater than zero.) if undefined', async () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';

  assert.throws(
    () =>
      buy(env)(
        {
          ticker: 'FACTMKT',
          title: '',
          registry: '',
          creator: '',
          position: '',
          balances: {},
          oppose: {},
          pair: '',
          settings: [
            ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
            ['isTradeable', true],
          ],
        },
        { caller, input: { position: 'support' } }
      ),
    /qty must be an integer greater than zero./
  );
});

test('should throw (qty must be an integer greater than zero.) if less than 0', async () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';
  assert.throws(
    () =>
      buy(env)(
        {
          ticker: 'FACTMKT',
          title: '',
          registry: '',
          creator: '',
          position: '',
          balances: {},
          oppose: {},
          pair: '',
          settings: [
            ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
            ['isTradeable', true],
          ],
        },
        { caller, input: { position: 'support', qty: 0.1 } }
      ),
    /qty must be an integer greater than zero./
  );
});

test('should throw (qty must be an integer greater than zero.) if string', async () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';

  assert.throws(
    () =>
      buy(env)(
        {
          ticker: 'FACTMKT',
          title: '',
          registry: '',
          creator: '',
          position: '',
          balances: {},
          oppose: {},
          pair: '',
          settings: [
            ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
            ['isTradeable', true],
          ],
        },
        { caller, input: { position: 'support', qty: '0.1' } }
      ),
    /qty must be an integer greater than zero./
  );
});

test('should throw (Incorrect price.)', async () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';
  assert.throws(
    () =>
      buy(env)(
        {
          ticker: 'FACTMKT',
          title: '',
          registry: '',
          creator: '',
          position: 'support',
          balances: {
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
            price: 99,
            fee: 5,
            tx: '<tx>',
            owner: {
              addr: '<owner-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx>',
              position: 'oppose',
            },
          },
        }
      ),
    /owner position must be support./
  );
});

test('should throw (Incorrect fee.)', async () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';

  assert.throws(
    () =>
      buy(env)(
        {
          ticker: 'FACTMKT',
          title: '',
          registry: '',
          creator: '',
          position: 'support',
          balances: {
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
            owner: {
              addr: '<owner-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx>',
              position: 'support',
            },
            position: 'support',
            qty: 1,
            price: 100,
            fee: 4,
            tx: '<tx>',
          },
        }
      ),
    /Incorrect fee./
  );
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
      balances: {
        '<jshaw>': 99,
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
        qty: 1,
        price: 100,
        fee: 5,
        tx,
        owner: {
          addr: '<owner-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx>',
          position: 'support',
        },
      },
    }
  );
  const { state } = output;
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
      balances: {},
      oppose: {
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
        owner: {
          addr: '<owner-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx>',
          position: 'oppose',
        },
        position: 'oppose',
        qty: 1,
        price: 100,
        fee: 5,
        tx,
      },
    }
  );
  const { state } = output;
  assert.is(state.oppose[caller], 1);
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
      balances: {
        '<jshaw>': 99,
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
        owner: {
          addr: '<owner-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx>',
          position: 'support',
        },
        position: 'support',
        qty: 2,
        price: 200,
        fee: 10,
        tx,
      },
    }
  );
  const { state } = output;
  assert.is(state.balances[caller], 2);
});

test.run();
