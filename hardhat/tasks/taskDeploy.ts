import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:deployUltraverifier").setAction(async function ({ ethers }) {
  const signers = await ethers.getSigners();
  const ultraverifierFactory = await ethers.getContractFactory("UltraVerifier");
  const ultraverifier = await ultraverifierFactory.connect(signers[0]).deploy();
  await ultraverifier.waitForDeployment();
  console.log("ultraverifier deployed to: ", await ultraverifier.getAddress());
});
