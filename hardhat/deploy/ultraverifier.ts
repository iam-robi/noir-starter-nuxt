import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const ultraverifier = await deploy("UltraVerifier", {
    from: deployer,
    // args: ["Bonjour, le monde!"],
    log: true,
  });

  console.log(`Ultraverifier contract: `, ultraverifier.address);
};
export default func;
func.id = "deploy_ultraverifier"; // id required to prevent reexecution
func.tags = ["UltraVerifier"];
