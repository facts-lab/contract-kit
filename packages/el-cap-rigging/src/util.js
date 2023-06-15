export function validateUserIsModerator(user) {
  if (user.role !== "moderator") {
    throw new ContractError("User is not a moderator");
  }
}

export function validateCoins(coins) {
  if (!Array.isArray(coins) || coins.some((coin) => typeof coin !== "object")) {
    throw new ContractError("Invalid coins array");
  }
}

export function validateCoin(coin) {
  if (typeof coin !== "object") {
    throw new ContractError("Invalid coin object");
  }
}
