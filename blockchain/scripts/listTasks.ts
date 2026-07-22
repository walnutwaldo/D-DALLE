import {ethers} from "hardhat";
import {attachDDALLE, loadDeployment, runMain} from "./utils";

// const CONTRACT_ADDRESS = '0x230a6C4727697CCDfF39c3b599DfAF2D6cb04fe2' // testnet
// Load contract address from deployment.json
const CONTRACT_ADDRESS = loadDeployment().address;

async function main() {
    const signers = await ethers.getSigners();
    const signer = signers[1];

    const contract = await attachDDALLE(CONTRACT_ADDRESS);

    const numTasks = await contract.numTasks();
    console.log("Number of tasks:", numTasks.toString());

    for (let i = 0; i < numTasks.toNumber(); i += 10) {
        const page = await contract.getTasks(i);
        console.log(`Page ${i}:`, page);
    }
}

runMain(main);
