/**
 * @description Validates a target exists that isn't the caller.
 * @todo Check that "target" is a valid arweave address?
 *
 * @author @jshaw-ar
 * @export
 * @param {string} caller
 * @param {string} [target]
 */
export function validateTarget(caller, target) {
  if (!target) throw new ContractError('Please specify a target.');
  if (target === caller)
    throw new ContractError('Target cannot be the caller.');
}

/**
 * @description Validates the quantity of tokens to "allow"
 *
 * @author @jshaw-ar
 * @export
 * @param {number} [balance]
 * @param {number} [qty]
 */
export function validateBalanceGreaterThanQuantity(balance, qty) {
  if (!balance) throw new ContractError('Caller does not have a balance.');
  if (!qty) throw new ContractError('Please specify a quantity.');
  if (!Number.isInteger(qty))
    throw new ContractError('qty must be an integer.');
  if (!Number.isInteger(balance))
    throw new ContractError('balance must be an integer.');
  if (balance < qty) throw new ContractError('Not enough tokens for allow.');
}

/**
 * @description Check that balance is an integer >= 0 after claim
 *
 * @author @jshaw-ar
 * @export
 * @param {number} balance
 */
export function validateBalance(balance) {
  if (!Number.isInteger(balance) || balance < 0)
    throw new ContractError('Incorrect balance after creating claimable.');
}

/**
 * @description Validate that qty is an integer greater than 0
 *
 * @author @jshaw-ar
 * @export
 * @param {number} qty
 */
export function validateQuantityGreaterThanZero(qty) {
  if (!Number.isInteger(qty) || qty < 1)
    throw new ContractError('Quantity must be an integer greater than 0.');
}

/**
 * @description Validate that qty is an integer greater than 0
 *
 * @author @jshaw-ar
 * @export
 * @param {number} qty
 */
export function validateQuantityOfClaim(qty, claimQty) {
  validateQuantityGreaterThanZero(qty);
  if (qty !== claimQty)
    throw new ContractError('Claiming incorrect quantity of tokens.');
}

export function validateClaim(tx, claims, claimable, caller) {
  const claimArr = claimable.filter((c) => c.tx === tx);
  if (!claimable.length)
    throw new ContractError('There are no claims available.');
  if (claimArr.length !== 1)
    throw new ContractError('There must be 1 claim with this tx.');
  if (claims.includes(tx)) throw new ContractError('Claim already processed.');
  if (claimArr[0]?.to !== caller)
    throw new ContractError('Claim not addressed to caller');
  return claimArr[0];
}

/**
 * @description validate that a tx exists
 * @todo Make sure it's an arweave address?
 *
 * @author @jshaw-ar
 * @export
 * @param {string} tx
 */
export function validateTx(tx) {
  if (!tx) throw new Error('tx must be set.');
}
