// import { suite } from 'uvu';
// import * as assert from 'uvu/assert';

// import { buy } from '../src/write/buy.js';
// import { setupSmartWeaveEnv } from './setup.js';

// const test = suite('buy');

// test('should throw (position must be support or oppose.) if undefined', async () => {
//   const env = setupSmartWeaveEnv({});
//   const caller = '<justin>';

//   try {
//     await buy(env)(
//       {
//         ticker: 'FACTMKT',
//         name: '',
//         balances: {},
//         settings: [
//           ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
//           ['isTradeable', true],
//         ],
//       },
//       { caller, input: {} }
//     );
//     assert.unreachable();
//   } catch (e) {
//     assert.is(e.message, 'position must be support or oppose.');
//   }
// });

// test('should throw (position must be support or oppose.) if wrong', async () => {
//   const env = setupSmartWeaveEnv({});
//   const caller = '<justin>';

//   try {
//     await buy(env)(
//       {
//         ticker: 'FACTMKT',
//         name: '',
//         balances: {},
//         settings: [
//           ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
//           ['isTradeable', true],
//         ],
//       },
//       { caller, input: { position: 'suppor' } }
//     );
//     assert.unreachable();
//   } catch (e) {
//     assert.is(e.message, 'position must be support or oppose.');
//   }
// });

// test('should throw (qty must be an integer greater than zero.) if undefined', async () => {
//   const env = setupSmartWeaveEnv({});
//   const caller = '<justin>';
//   try {
//     await buy(env)(
//       {
//         ticker: 'FACTMKT',
//         title: '',
//         registry: '',
//         creator: '',
//         position: '',
//         balances: {},
//         oppose: {},
//         pair: '',
//         settings: [
//           ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
//           ['isTradeable', true],
//         ],
//       },
//       { caller, input: { position: 'support' } }
//     );
//     assert.unreachable();
//   } catch (e) {
//     assert.is(e.message, 'qty must be an integer greater than zero.');
//   }
// });

// test('should throw (qty must be an integer greater than zero.) if less than 0', async () => {
//   const env = setupSmartWeaveEnv({});
//   const caller = '<justin>';
//   try {
//     await buy(env)(
//       {
//         ticker: 'FACTMKT',
//         title: '',
//         registry: '',
//         creator: '',
//         position: '',
//         balances: {},
//         oppose: {},
//         pair: '',
//         settings: [
//           ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
//           ['isTradeable', true],
//         ],
//       },
//       { caller, input: { position: 'support', qty: 0.1 } }
//     );
//     assert.unreachable();
//   } catch (e) {
//     assert.is(e.message, 'qty must be an integer greater than zero.');
//   }
// });

// test('should throw (qty must be an integer greater than zero.) if string', async () => {
//   const env = setupSmartWeaveEnv({});
//   const caller = '<justin>';

//   try {
//     await buy(env)(
//       {
//         ticker: 'FACTMKT',
//         title: '',
//         registry: '',
//         creator: '',
//         position: '',
//         balances: {},
//         oppose: {},
//         pair: '',
//         settings: [
//           ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
//           ['isTradeable', true],
//         ],
//       },
//       { caller, input: { position: 'support', qty: '0.1' } }
//     );
//     assert.unreachable();
//   } catch (e) {
//     assert.is(e.message, 'qty must be an integer greater than zero.');
//   }
// });

// test('should throw (Incorrect price.)', async () => {
//   const env = setupSmartWeaveEnv({
//     write: true,
//     readContractState: {
//       ticker: 'TU',
//       name: 'TU',
//       settings: [['isTradeable', true]],
//       claimable: [
//         {
//           txID: '<tx>',
//           to: '<contract-id-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx>',
//           from: '<justin>',
//           qty: 210,
//         },
//       ],
//       balances: {
//         '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4': 100000000,
//       },
//       divisibility: 1e6,
//     },
//   });
//   const caller = '<justin>';
//   const tx = '<tx>';

//   try {
//     await buy(env)(
//       {
//         ticker: 'FACTMKT',
//         title: '',
//         registry: '',
//         creator: '',
//         position: 'support',
//         balances: {
//           '<jshaw>': 99,
//         },
//         oppose: {},
//         pair: '',
//         settings: [
//           ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
//           ['isTradeable', true],
//         ],
//       },
//       {
//         caller,
//         input: {
//           position: 'support',
//           qty: 2,
//           price: 199,
//           fee: 11,
//           tx,
//         },
//       }
//     );
//     assert.unreachable();
//   } catch (e) {
//     console.log('Error!', e.message);
//     assert.is(e.message, 'Incorrect price.');
//   }
// });

// test('should buy 1 support token for 100 base units with a fee of 5 base units', async () => {
//   const env = setupSmartWeaveEnv({
//     write: true,
//     readContractState: {
//       ticker: 'TU',
//       name: 'TU',
//       settings: [['isTradeable', true]],
//       claimable: [
//         {
//           txID: '<tx>',
//           to: '<contract-id-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx>',
//           from: '<justin>',
//           qty: 2,
//         },
//       ],
//       balances: {
//         '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4': 100000000,
//       },
//       divisibility: 1e6,
//     },
//   });
//   const caller = '<justin>';
//   const tx = '<tx>';
//   const pair = '<pair>';
//   const output = await buy(env)(
//     {
//       ticker: 'FACTMKT',
//       title: '',
//       registry: '',
//       creator: '',
//       position: 'support',
//       balances: {},
//       oppose: {},
//       pair,
//       settings: [
//         ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
//         ['isTradeable', true],
//       ],
//     },
//     {
//       caller,
//       input: {
//         position: 'support',
//         qty: 1,
//         price: 1,
//         fee: 1,
//         tx,
//       },
//     }
//   );
//   const { state } = output;
//   assert.is(state.balances[caller], 1);
// });

// test('should buy 1 oppose token for 1 base units with a fee of 1 base units', async () => {
//   const env = setupSmartWeaveEnv({
//     write: true,
//     readContractState: {
//       ticker: 'TU',
//       name: 'TU',
//       settings: [['isTradeable', true]],
//       claimable: [
//         {
//           txID: '<tx>',
//           to: '<contract-id-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx>',
//           from: '<justin>',
//           qty: 2,
//         },
//       ],
//       balances: {
//         '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4': 100000000,
//       },
//       divisibility: 1e6,
//     },
//   });
//   const caller = '<justin>';
//   const tx = '<tx>';
//   const pair = '<pair>';
//   const output = await buy(env)(
//     {
//       ticker: 'FACTMKT',
//       title: '',
//       registry: '',
//       creator: '',
//       position: 'oppose',
//       balances: {},
//       oppose: {},
//       pair,
//       settings: [
//         ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
//         ['isTradeable', true],
//       ],
//     },
//     {
//       caller,
//       input: {
//         owner: {
//           addr: '<owner-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx>',
//           position: 'oppose',
//         },
//         position: 'oppose',
//         qty: 1,
//         price: 1,
//         fee: 1,
//         tx,
//       },
//     }
//   );
//   const { state } = output;
//   assert.is(state.oppose[caller], 1);
// });

// test('should buy 2 support token for 200 base units with a fee of 10 base units', async () => {
//   const env = setupSmartWeaveEnv({
//     write: true,
//     readContractState: {
//       ticker: 'TU',
//       name: 'TU',
//       settings: [['isTradeable', true]],
//       claimable: [
//         {
//           txID: '<tx>',
//           to: '<contract-id-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx>',
//           from: '<justin>',
//           qty: 210,
//         },
//       ],
//       balances: {
//         '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4': 100000000,
//       },
//       divisibility: 1e6,
//     },
//   });
//   const caller = '<justin>';
//   const tx = '<tx>';
//   const pair = '<pair>';
//   const output = await buy(env)(
//     {
//       ticker: 'FACTMKT',
//       title: '',
//       registry: '',
//       creator: '',
//       position: 'support',
//       balances: {
//         '<jshaw>': 99,
//       },
//       oppose: {},
//       pair,
//       settings: [
//         ['communityLogo', 'dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80'],
//         ['isTradeable', true],
//       ],
//     },
//     {
//       caller,
//       input: {
//         position: 'support',
//         qty: 2,
//         price: 200,
//         fee: 10,
//         tx,
//       },
//     }
//   );
//   const { state } = output;
//   assert.is(state.balances[caller], 2);
// });

// test.run();
