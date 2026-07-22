import {ethers} from "hardhat";
import fs from 'fs';
import {loadArtifactAbi, runMain, saveDeployment} from "./utils";

const DDALLE_ARTIFACT_PATH = "./artifacts/contracts/DDALLE.Sol/DDALLE.json";
const DDALLE_SUBMISSIONS_ARTIFACT_PATH = "./artifacts/contracts/DDALLESubmissions.Sol/DDALLESubmissions.json";

const DDALLE_ABI = loadArtifactAbi(DDALLE_ARTIFACT_PATH);
const DDALLE_SUBMISSIONS_ABI = loadArtifactAbi(DDALLE_SUBMISSIONS_ARTIFACT_PATH);

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
    saveDeployment({
        address: address,
    });

    deployment.abi = DDALLE_ABI;
    deployment.submissions_abi = DDALLE_SUBMISSIONS_ABI;
    deployment.address[ethers.provider.network.chainId] = address;
    const deploymentString = JSON.stringify(deployment, null, 2);

    fs.writeFileSync(FRONTEND_DEPLOYMENT_INFO, deploymentString);
    fs.writeFileSync(BACKEND_DEPLOYMENT_INFO, deploymentString);
}

runMain(main);
