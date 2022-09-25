import {ethers} from "hardhat";
import fs from 'fs';

const DDALLE_ARTIFACT_PATH = "./artifacts/contracts/DDALLE.Sol/DDALLE.json";

const DDALLE_ABI = JSON.parse(
    fs.readFileSync(DDALLE_ARTIFACT_PATH, "utf8")
)["abi"];

const FRONTEND_DEPLOYMENT_INFO = '../frontend/src/constants/DDALLE_DEPLOYMENT.json';
const BACKEND_DEPLOYMENT_INFO = '../backend/abi/DDALLE_DEPLOYMENT.json';

const deployment = JSON.parse(fs.readFileSync(FRONTEND_DEPLOYMENT_INFO, 'utf8'));

async function main() {
    const signers = await ethers.getSigners();
    const signer = signers[0];

    const factory = await ethers.getContractFactory("DDALLE");
    const contract = await factory.deploy();

    await contract.connect(signer).deployed();

    const address = contract.address;
    console.log("DDALLE deployed to:", contract.address);
    console.log("Owner:", await contract.owner());

    // Update deployment.json to change address to deployed contract address
    fs.writeFileSync('deployment.json', JSON.stringify({
        address: address,
    }, null, 2));

    deployment.abi = DDALLE_ABI;
    deployment.address[ethers.provider.network.chainId] = address;
    const deploymentString = JSON.stringify(deployment, null, 2);

    fs.writeFileSync(FRONTEND_DEPLOYMENT_INFO, deploymentString);
    fs.writeFileSync(BACKEND_DEPLOYMENT_INFO, deploymentString);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
