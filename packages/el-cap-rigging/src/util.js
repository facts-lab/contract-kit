export function validateCrewMemberIsModerator(crewMember, crew) {
  const foundCrewMember = crew.find((u) => u.address === crewMember.address);

  if (!foundCrewMember || foundCrewMember.role !== "moderator") {
    throw new ContractError("CrewMember is not a moderator");
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
