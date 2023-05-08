/**
 * @description Same as ContractAssert with a passthrough
 *
 * @author @jshaw-ar
 * @param {*} flag What your conditional check is
 * @param {*} message Error message if conditional is true
 * @param {*} p The payload to pass through the func
 * @return {*} p
 */
export const ca = (flag, message) => (p) => flag ? Left(message) : Right(p);

export const isVouched = (tx) => {};

export async function vouchedWallets(state, action) {
  const s = await SmartWeave.contracts.readContractState(
    "_z0ch80z_daDUFqC9jHjfOL8nekJcok4ZRkE_UesYsk"
  );
  return s.vouched;
}
