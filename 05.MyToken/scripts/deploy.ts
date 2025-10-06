import { network } from "hardhat";
const { ethers } = await network.connect();

async function main() {
  // 1 million tokens with 18 decimals
  const initialSupply = "1000000000000000000000000";

  const Token = await ethers.getContractFactory("MyToken");

  const token = await Token.deploy(initialSupply);
  await token.waitForDeployment();

  console.log("MyToken deployed to:", token.address);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
