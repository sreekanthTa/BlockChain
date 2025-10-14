import { network } from "hardhat";

const { ethers } = await network.connect();


async function main() {
  const VotingFactory = await ethers.getContractFactory("Voting"); // ✅ use hre.ethers
  const voting = await VotingFactory.deploy(["Alice", "Bob", "Charlie"]);

  console.log("Voting deployed at:", voting.target); // Ethers 6
}

main().catch(console.error);
