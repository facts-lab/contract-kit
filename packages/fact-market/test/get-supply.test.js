// import { suite } from 'uvu';
// import * as assert from 'uvu/assert';

// import { getSupply } from '../src/read/get-supply.js';
// import { setupSmartWeaveEnv } from './setup.js';

// const test = suite('get-supply');

// test('should get supply', () => {
//   const env = setupSmartWeaveEnv({ write: true });
//   const caller = '<justin>';
//   const tx = '<test-tx>';
//   const pair = '<pair>';

//   const output = getSupply(
//     {
//       ticker: 'FACTMKT',
//       title: '',
//       creator: '<justin>',
//       position: 'oppose',
//       creator_cut: 1,
//       oppose: {
//         '<jshaw0>': 100,
//         '<jshaw1>': 100,
//       },
//       balances: {
//         '<jshaw2>': 100,
//         '<jshaw3>': 100,
//         '<jshaw4>': 100,
//         '<jshaw5>': 100,
//       },
//       pair,
//       settings: [
//         ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
//         ['isTradeable', true],
//       ],
//     },
//     {
//       caller,
//     }
//   );
//   console.log('OUTPUT', output);

//   const { result } = output;
//   assert.is(result.total, 600);
//   assert.is(result.support, 400);
//   assert.is(result.oppose, 200);
// });

// test.run();
