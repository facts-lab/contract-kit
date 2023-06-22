import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { getPrice } from '../src/read/get-price.js';
import { setupSmartWeaveEnv } from './setup.js';

const test = suite('get-price');

test('should throw (Position must be support or oppose.)', () => {
  const env = setupSmartWeaveEnv({});

  assert.throws(
    () =>
      getPrice(env)(
        {
          ticker: 'FACTMKT',
          title: '',
          registry: '',
          creator: 'test',
          position: 'support',
          creator_cut: 49000,
          balances: {
            '<jshaw>': 99,
            '<justin>': 1,
          },
          oppositionBalances: {},
          pair: '<pair>',
          settings: [
            ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
            ['isTradeable', true],
          ],
        },
        {
          input: {},
        }
      ),
    /Position must be support or oppose./
  );
});

test('should throw (Please specify a qty.) if qty undefined', () => {
  const env = setupSmartWeaveEnv({});

  assert.throws(
    () =>
      getPrice(env)(
        {
          ticker: 'FACTMKT',
          title: '',
          registry: '',
          creator: 'test',
          position: 'support',
          creator_cut: 49000,
          balances: {
            '<jshaw>': 99,
            '<justin>': 1,
          },
          oppositionBalances: {},
          pair: '<pair>',
          settings: [
            ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
            ['isTradeable', true],
          ],
        },
        {
          input: { position: 'support' },
        }
      ),
    /qty must be an integer greater than zero./
  );
});

test('should throw (Please specify a qty.) if qty less than 1', () => {
  const env = setupSmartWeaveEnv({});

  assert.throws(
    () =>
      getPrice(env)(
        {
          ticker: 'FACTMKT',
          title: '',
          registry: '',
          creator: 'test',
          position: 'support',
          creator_cut: 49000,
          balances: {
            '<jshaw>': 99,
            '<justin>': 1,
          },
          oppositionBalances: {},
          pair: '<pair>',
          settings: [
            ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
            ['isTradeable', true],
          ],
        },
        {
          input: { position: 'support', qty: 0.99 },
        }
      ),
    /qty must be an integer greater than zero./
  );
});

test('should throw (Please specify a qty.) if qty a string of text', () => {
  const env = setupSmartWeaveEnv({});

  assert.throws(
    () =>
      getPrice(env)(
        {
          ticker: 'FACTMKT',
          title: '',
          registry: '',
          creator: 'test',
          position: 'support',
          creator_cut: 49000,
          balances: {
            '<jshaw>': 99,
            '<justin>': 1,
          },
          oppositionBalances: {},
          pair: '<pair>',
          settings: [
            ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
            ['isTradeable', true],
          ],
        },
        {
          input: { position: 'support', qty: 'xxx' },
        }
      ),
    /qty must be an integer greater than zero./
  );
});

test('should work oppose', () => {
  const env = setupSmartWeaveEnv({});

  const output = getPrice(env)(
    {
      ticker: 'FACTMKT',
      title: '',
      registry: '',
      creator: 'test',
      position: 'oppose',
      creator_cut: 49000,
      balances: {
        '<jshaw>': 99,
        '<justin>': 1,
      },
      oppositionBalances: {},
      pair: '<pair>',
      settings: [
        ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
        ['isTradeable', true],
      ],
    },
    {
      input: { position: 'oppose', qty: '1' },
    }
  );

  const { result } = output;
  assert.is(result.qty, 1);
  assert.is(result.price, 1);
  assert.is(result.fee, 1);
  assert.is(result.owner.position, 'oppose');
  assert.is(result.position, 'oppose');
});

test('should work support', () => {
  const env = setupSmartWeaveEnv({});

  const output = getPrice(env)(
    {
      ticker: 'FACTMKT',
      title: '',
      registry: '',
      creator: 'test',
      position: 'support',
      creator_cut: 49000,
      balances: {
        '<jshaw>': 99,
        '<justin>': 1,
      },
      oppositionBalances: {},
      pair: '<pair>',
      settings: [
        ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
        ['isTradeable', true],
      ],
    },
    {
      input: { position: 'support', qty: '1' },
    }
  );

  const { result } = output;
  assert.is(result.qty, 1);
  assert.is(result.price, 101);
  assert.is(result.fee, 6);
  assert.is(result.owner.position, 'support');
  assert.is(result.position, 'support');
});

test.run();
