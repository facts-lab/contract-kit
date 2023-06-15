export function validateUserIsModerator(user) {
  if (user.role !== "moderator") {
    throw new ContractError("User is not a moderator");
  }
}
