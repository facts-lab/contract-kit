// import { suite } from 'uvu';
// import * as assert from 'uvu/assert';
// import { register } from '../src/write/register.js';
// import { setupSmartWeaveEnv } from './setup.js';
// const test = suite('register');

// test.before(() => {});

// test('should throw (qty must be an integer greater than zero.) if qty undefined', async () => {
//   const caller = '<fact-mkt>';
//   const env = setupSmartWeaveEnv();

//   // Asynchronous testing: https://github.com/lukeed/uvu/issues/35
//   try {
//     await register(env)(
//       {
//         name: 'Facts Token',
//         ticker: 'FACTS',
//         positions: [],
//         balances: {},
//         settings: [
//           ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
//           ['isTradeable', true],
//         ],
//         claimable: [],
//         divisibility: 1e6,
//       },
//       { caller }
//     );
//     assert.unreachable('should have thrown');
//   } catch (err) {
//     assert.is(err.message, 'qty must be an integer.');
//     assert.ok('threw error');
//     assert.instance(err, Error);
//   }
// });

// test('should throw (qty must be an integer greater than zero.) if qty string', async () => {
//   const caller = '<fact-mkt>';
//   const env = setupSmartWeaveEnv();

//   try {
//     await register(env)(
//       {
//         name: 'Facts Token',
//         ticker: 'FACTS',
//         positions: [],
//         balances: {},
//         settings: [
//           ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
//           ['isTradeable', true],
//         ],
//         claimable: [],
//         divisibility: 1e6,
//       },
//       { caller, input: { qty: 'x' } }
//     );
//     assert.unreachable('should have thrown');
//   } catch (err) {
//     assert.is(err.message, 'qty must be an integer.');
//     assert.ok('threw error');
//     assert.instance(err, Error);
//   }
// });

// test('should throw (qty must be an integer greater than zero.) if qty undefined', async () => {
//   const caller = '<fact-mkt>';
//   const env = setupSmartWeaveEnv();

//   try {
//     await register(env)(
//       {
//         name: 'Facts Token',
//         ticker: 'FACTS',
//         positions: [],
//         balances: {},
//         settings: [
//           ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
//           ['isTradeable', true],
//         ],
//         claimable: [],
//         divisibility: 1e6,
//       },
//       { caller, input: { qty: undefined } }
//     );
//     assert.unreachable('should have thrown');
//   } catch (err) {
//     assert.is(err.message, 'qty must be an integer.');
//     assert.ok('threw error');
//     assert.instance(err, Error);
//   }
// });
// test('should throw (qty must be an integer greater than zero.) if qty null', async () => {
//   const caller = '<fact-mkt>';
//   const env = setupSmartWeaveEnv();

//   try {
//     await register(env)(
//       {
//         name: 'Facts Token',
//         ticker: 'FACTS',
//         positions: [],
//         balances: {},
//         settings: [
//           ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
//           ['isTradeable', true],
//         ],
//         claimable: [],
//         divisibility: 1e6,
//       },
//       { caller, input: { qty: null } }
//     );
//     assert.unreachable('should have thrown');
//   } catch (err) {
//     assert.is(err.message, 'qty must be an integer.');
//     assert.ok('threw error');
//     assert.instance(err, Error);
//   }
// });

// test('should throw (qty must be an integer greater than zero.) if qty 0', async () => {
//   const caller = '<fact-mkt>';
//   const env = setupSmartWeaveEnv();

//   try {
//     await register(env)(
//       {
//         name: 'Facts Token',
//         ticker: 'FACTS',
//         positions: [],
//         balances: {},
//         settings: [
//           ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
//           ['isTradeable', true],
//         ],
//         claimable: [],
//         divisibility: 1e6,
//       },
//       { caller, input: { qty: 0 } }
//     );
//     assert.unreachable('should have thrown');
//   } catch (err) {
//     assert.is(err.message, 'qty must be an integer greater than zero.');
//     assert.ok('threw error');
//     assert.instance(err, Error);
//   }
// });

// test('should throw (addr must be 43 chars.) if addr undefined', async () => {
//   const caller = '<fact-mkt>';
//   const env = setupSmartWeaveEnv();

//   try {
//     await register(env)(
//       {
//         name: 'Facts Token',
//         ticker: 'FACTS',
//         positions: [],
//         balances: {},
//         settings: [
//           ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
//           ['isTradeable', true],
//         ],
//         claimable: [],
//         divisibility: 1e6,
//       },
//       { caller, input: { qty: 1 } }
//     );
//     assert.unreachable('should have thrown');
//   } catch (err) {
//     assert.is(err.message, 'addr must be 43 chars.');
//     assert.ok('threw error');
//     assert.instance(err, Error);
//   }
// });

// test('should throw (addr must be 43 chars.) if addr ""', async () => {
//   const caller = '<fact-mkt>';
//   const env = setupSmartWeaveEnv();

//   try {
//     await register(env)(
//       {
//         name: 'Facts Token',
//         ticker: 'FACTS',
//         positions: [],
//         balances: {},
//         settings: [
//           ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
//           ['isTradeable', true],
//         ],
//         claimable: [],
//         divisibility: 1e6,
//       },
//       { caller, input: { qty: 1, addr: '' } }
//     );
//     assert.unreachable('should have thrown');
//   } catch (err) {
//     assert.is(err.message, 'addr must be 43 chars.');
//     assert.ok('threw error');
//     assert.instance(err, Error);
//   }
// });

// test('should throw (addr must be 43 chars.) if addr is 42 chars', async () => {
//   const caller = '<fact-mkt>';
//   const env = setupSmartWeaveEnv();

//   const addr = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 42 chars
//   try {
//     await register(env)(
//       {
//         name: 'Facts Token',
//         ticker: 'FACTS',
//         positions: [],
//         balances: {},
//         settings: [
//           ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
//           ['isTradeable', true],
//         ],
//         claimable: [],
//         divisibility: 1e6,
//       },
//       {
//         caller,
//         input: { qty: 1, addr },
//       }
//     );
//     assert.unreachable('should have thrown');
//   } catch (err) {
//     assert.is(err.message, 'addr must be 43 chars.');
//     assert.ok('threw error');
//     assert.instance(err, Error);
//   }
// });

// test('should throw (addr must be 43 chars.) if addr is 44 chars', async () => {
//   const caller = '<fact-mkt>';
//   const env = setupSmartWeaveEnv();

//   const addr = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 42 chars
//   try {
//     await register(env)(
//       {
//         name: 'Facts Token',
//         ticker: 'FACTS',
//         positions: [],
//         balances: {},
//         settings: [
//           ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
//           ['isTradeable', true],
//         ],
//         claimable: [],
//         divisibility: 1e6,
//       },
//       {
//         caller,
//         input: { qty: 1, addr },
//       }
//     );
//     assert.unreachable('should have thrown');
//   } catch (err) {
//     assert.is(err.message, 'addr must be 43 chars.');
//     assert.ok('threw error');
//     assert.instance(err, Error);
//   }
// });

// test('should throw (tx must be 43 chars.) if tx undefined', async () => {
//   const caller = '<fact-mkt>';
//   const env = setupSmartWeaveEnv();
//   const addr = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 43 chars

//   try {
//     await register(env)(
//       {
//         name: 'Facts Token',
//         ticker: 'FACTS',
//         positions: [],
//         balances: {},
//         settings: [
//           ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
//           ['isTradeable', true],
//         ],
//         claimable: [],
//         divisibility: 1e6,
//       },
//       { caller, input: { qty: 1, addr } }
//     );
//     assert.unreachable('should have thrown');
//   } catch (err) {
//     assert.is(err.message, 'tx must be 43 chars.');
//     assert.ok('threw error');
//     assert.instance(err, Error);
//   }
// });

// test('should throw (tx must be 43 chars.) if tx ""', async () => {
//   const caller = '<fact-mkt>';
//   const env = setupSmartWeaveEnv();
//   const addr = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 43 chars

//   try {
//     await register(env)(
//       {
//         name: 'Facts Token',
//         ticker: 'FACTS',
//         positions: [],
//         balances: {},
//         settings: [
//           ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
//           ['isTradeable', true],
//         ],
//         claimable: [],
//         divisibility: 1e6,
//       },
//       { caller, input: { qty: 1, addr, tx: '' } }
//     );
//     assert.unreachable('should have thrown');
//   } catch (err) {
//     assert.is(err.message, 'tx must be 43 chars.');
//     assert.ok('threw error');
//     assert.instance(err, Error);
//   }
// });

// test('should throw (tx must be 43 chars.) if tx is 42 chars', async () => {
//   const caller = '<fact-mkt>';
//   const env = setupSmartWeaveEnv();

//   const addr = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 43 chars

//   try {
//     await register(env)(
//       {
//         name: 'Facts Token',
//         ticker: 'FACTS',
//         positions: [],
//         balances: {},
//         settings: [
//           ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
//           ['isTradeable', true],
//         ],
//         claimable: [],
//         divisibility: 1e6,
//       },
//       {
//         caller,
//         input: {
//           qty: 1,
//           addr,
//           tx: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//         },
//       }
//     );
//     assert.unreachable('should have thrown');
//   } catch (err) {
//     assert.is(err.message, 'tx must be 43 chars.');
//     assert.ok('threw error');
//     assert.instance(err, Error);
//   }
// });

// test('should throw (tx must be 43 chars.) if tx is 44 chars', async () => {
//   const caller = '<fact-mkt>';
//   const env = setupSmartWeaveEnv();

//   const addr = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 43 chars

//   try {
//     await register(env)(
//       {
//         name: 'Facts Token',
//         ticker: 'FACTS',
//         positions: [],
//         balances: {},
//         settings: [
//           ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
//           ['isTradeable', true],
//         ],
//         claimable: [],
//         divisibility: 1e6,
//       },
//       {
//         caller,
//         input: {
//           qty: 1,
//           addr,
//           tx: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//         },
//       }
//     );
//     assert.unreachable('should have thrown');
//   } catch (err) {
//     assert.is(err.message, 'tx must be 43 chars.');
//     assert.ok('threw error');
//     assert.instance(err, Error);
//   }
// });

// test('should throw (allowTx must be 43 chars.) if allowTx undefined', async () => {
//   const caller = '<fact-mkt>';
//   const env = setupSmartWeaveEnv();
//   const addr = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 43 chars
//   const tx = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 43 chars
//   const contract = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 43 chars

//   try {
//     await register(env)(
//       {
//         name: 'Facts Token',
//         ticker: 'FACTS',
//         positions: [],
//         balances: {},
//         settings: [
//           ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
//           ['isTradeable', true],
//         ],
//         claimable: [],
//         divisibility: 1e6,
//       },
//       { caller, input: { qty: 1, addr, tx, contract } }
//     );
//     assert.unreachable('should have thrown');
//   } catch (err) {
//     assert.is(err.message, 'allowTx must be 43 chars.');
//     assert.ok('threw error');
//     assert.instance(err, Error);
//   }
// });

// test('should throw (allowTx must be 43 chars.) if allowTx ""', async () => {
//   const caller = '<fact-mkt>';
//   const env = setupSmartWeaveEnv();
//   const addr = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 43 chars
//   const tx = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 43 chars
//   const contract = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 43 chars

//   try {
//     await register(env)(
//       {
//         name: 'Facts Token',
//         ticker: 'FACTS',
//         positions: [],
//         balances: {},
//         settings: [
//           ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
//           ['isTradeable', true],
//         ],
//         claimable: [],
//         divisibility: 1e6,
//       },
//       { caller, input: { qty: 1, addr, tx, contract, allowTx: '' } }
//     );
//     assert.unreachable('should have thrown');
//   } catch (err) {
//     assert.is(err.message, 'allowTx must be 43 chars.');
//     assert.ok('threw error');
//     assert.instance(err, Error);
//   }
// });

// test('should throw (allowTx must be 43 chars.) if allowTx is 42 chars', async () => {
//   const caller = '<fact-mkt>';
//   const env = setupSmartWeaveEnv();

//   const addr = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 43 chars
//   const tx = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 43 chars
//   const contract = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 43 chars

//   try {
//     await register(env)(
//       {
//         name: 'Facts Token',
//         ticker: 'FACTS',
//         positions: [],
//         balances: {},
//         settings: [
//           ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
//           ['isTradeable', true],
//         ],
//         claimable: [],
//         divisibility: 1e6,
//       },
//       {
//         caller,
//         input: {
//           qty: 1,
//           addr,
//           tx,
//           contract,
//           allowTx: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//         },
//       }
//     );
//     assert.unreachable('should have thrown');
//   } catch (err) {
//     assert.is(err.message, 'allowTx must be 43 chars.');
//     assert.ok('threw error');
//     assert.instance(err, Error);
//   }
// });

// test('should throw (allowTx must be 43 chars.) if allowTx is 44 chars', async () => {
//   const caller = '<fact-mkt>';
//   const env = setupSmartWeaveEnv();

//   const addr = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 43 chars
//   const tx = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 43 chars
//   const contract = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 43 chars

//   try {
//     await register(env)(
//       {
//         name: 'Facts Token',
//         ticker: 'FACTS',
//         positions: [],
//         balances: {},
//         settings: [
//           ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
//           ['isTradeable', true],
//         ],
//         claimable: [],
//         divisibility: 1e6,
//       },
//       {
//         caller,
//         input: {
//           qty: 1,
//           addr,
//           tx,
//           contract,
//           allowTx: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//         },
//       }
//     );
//     assert.unreachable('should have thrown');
//   } catch (err) {
//     assert.is(err.message, 'allowTx must be 43 chars.');
//     assert.ok('threw error');
//     assert.instance(err, Error);
//   }
// });

// test('should throw (contract must be 43 chars.) if contract undefined', async () => {
//   const caller = '<fact-mkt>';
//   const env = setupSmartWeaveEnv();
//   const addr = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 43 chars
//   const tx = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 43 chars

//   try {
//     await register(env)(
//       {
//         name: 'Facts Token',
//         ticker: 'FACTS',
//         positions: [],
//         balances: {},
//         settings: [
//           ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
//           ['isTradeable', true],
//         ],
//         claimable: [],
//         divisibility: 1e6,
//       },
//       { caller, input: { qty: 1, addr, tx } }
//     );
//     assert.unreachable('should have thrown');
//   } catch (err) {
//     assert.is(err.message, 'contract must be 43 chars.');
//     assert.ok('threw error');
//     assert.instance(err, Error);
//   }
// });

// test('should throw (contract must be 43 chars.) if contract ""', async () => {
//   const caller = '<fact-mkt>';
//   const env = setupSmartWeaveEnv();
//   const addr = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 43 chars
//   const tx = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 43 chars

//   try {
//     await register(env)(
//       {
//         name: 'Facts Token',
//         ticker: 'FACTS',
//         positions: [],
//         balances: {},
//         settings: [
//           ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
//           ['isTradeable', true],
//         ],
//         claimable: [],
//         divisibility: 1e6,
//       },
//       { caller, input: { qty: 1, addr, tx, contract: '' } }
//     );
//     assert.unreachable('should have thrown');
//   } catch (err) {
//     assert.is(err.message, 'contract must be 43 chars.');
//     assert.ok('threw error');
//     assert.instance(err, Error);
//   }
// });

// test('should throw (contract must be 43 chars.) if contract is 42 chars', async () => {
//   const caller = '<fact-mkt>';
//   const env = setupSmartWeaveEnv();

//   const addr = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 43 chars
//   const tx = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 43 chars

//   try {
//     await register(env)(
//       {
//         name: 'Facts Token',
//         ticker: 'FACTS',
//         positions: [],
//         balances: {},
//         settings: [
//           ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
//           ['isTradeable', true],
//         ],
//         claimable: [],
//         divisibility: 1e6,
//       },
//       {
//         caller,
//         input: {
//           qty: 1,
//           addr,
//           tx,
//           contract: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//         },
//       }
//     );
//     assert.unreachable('should have thrown');
//   } catch (err) {
//     assert.is(err.message, 'contract must be 43 chars.');
//     assert.ok('threw error');
//     assert.instance(err, Error);
//   }
// });

// test('should throw (contract must be 43 chars.) if contract is 44 chars', async () => {
//   const caller = '<fact-mkt>';
//   const env = setupSmartWeaveEnv();

//   const addr = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 43 chars
//   const tx = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 43 chars

//   try {
//     await register(env)(
//       {
//         name: 'Facts Token',
//         ticker: 'FACTS',
//         positions: [],
//         balances: {},
//         settings: [
//           ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
//           ['isTradeable', true],
//         ],
//         claimable: [],
//         divisibility: 1e6,
//       },
//       {
//         caller,
//         input: {
//           qty: 1,
//           addr,
//           tx,
//           contract: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//         },
//       }
//     );
//     assert.unreachable('should have thrown');
//   } catch (err) {
//     assert.is(err.message, 'contract must be 43 chars.');
//     assert.ok('threw error');
//     assert.instance(err, Error);
//   }
// });

// // test('should allow to existing account', async () => {
// //   const caller = '<justin>';
// //   const env = setupSmartWeaveEnv(
// //     undefined,
// //     undefined,
// //     '<tx>',
// //     undefined,
// //     undefined,
// //     undefined
// //   );
// //   const output = await allow(
// //     {
// //       name: 'Facts Token',
// //       ticker: 'FACTS',
// //       settings: [
// //         ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
// //         ['isTradeable', true],
// //       ],
// //       balances: {
// //         [caller]: 10,
// //         '<tom>': 10,
// //       },
// //       positions: [],
// //       claimable: [],
// //       divisibility: 1e6,
// //     },
// //     { caller, input: { target: '<tom>', qty: 10 } }
// //   );

// //   const { state } = output;
// //   assert.equal(state.balances[caller], 0);
// //   assert.equal(state.claimable[0]?.to, '<tom>');
// //   assert.equal(state.claimable[0]?.qty, 10);
// //   assert.equal(state.claimable[0]?.qty + state.balances['<tom>'], 20);
// // });

// test.after(async () => {});

// test.run();
