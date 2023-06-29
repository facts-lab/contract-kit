import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { sell } from '../src/write/sell.js';
import { setupSmartWeaveEnv } from './setup.js';

const test = suite('sell');

test('should throw (position must be support or oppose.) if undefined', () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';
  assert.throws(
    () =>
      sell(env)(
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
      ),
    /position must be support or oppose./
  );
});

test('should throw (position must be support or oppose.) if wrong', () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';
  assert.throws(
    () =>
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
        { caller, input: { position: 'suppor' } }
      ),
    /position must be support or oppose./
  );
});

test('should throw (qty must be an integer greater than zero.) if undefined', () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';
  assert.throws(
    () =>
      sell(env)(
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
      ),
    /qty must be an integer greater than zero./
  );
});

test('should throw (qty must be an integer greater than zero.) if less than 0', () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';
  assert.throws(
    () =>
      sell(env)(
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
      ),
    /qty must be an integer greater than zero./
  );
});

test('should throw (qty must be an integer greater than zero.) if string', () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';
  assert.throws(
    () =>
      sell(env)(
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
      ),
    /qty must be an integer greater than zero./
  );
});

test('should throw (Incorrect price.)', () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';

  assert.throws(
    () =>
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
      ),
    /The price has changed./
  );
});

test('should throw (Incorrect fee.)', () => {
  const env = setupSmartWeaveEnv({});
  const caller = '<justin>';
  assert.throws(
    () =>
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
            price: 100,
            fee: 4,
            txId: '<txId>',
          },
        }
      ),
    /The price has changed./
  );
});

test('should throw (Error: An error occurred while claiming the pair.) if claim doesnt work.', () => {
  const env = setupSmartWeaveEnv({ write: false });
  const caller = '<justin>';
  const txId = '<txId>';
  const pair = '<pair>';
  assert.throws(
    () =>
      sell(env)(
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
            txId,
          },
        }
      ),
    /Caller balance too low./
  );
});

test('should sell 1 support token for 100 base units with a fee of 5 base units', () => {
  const env = setupSmartWeaveEnv({ write: true });
  const caller = '<justin>';
  const txId = '<txId>';
  const pair = '<pair>';
  const output = sell(env)(
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
        expected: 99,
        qty: 1,
      },
    }
  );
  const { state } = output;

  assert.is(state.creator_cut, 0);
  assert.is(state.balances[caller], 0);
});

test('should not distribute to creator', () => {
  const env = setupSmartWeaveEnv({ write: true });
  const caller = '<justin>';
  const creator = 'test';
  const txId = '<txId>';
  const pair = '<pair>';
  const output = sell(env)(
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
