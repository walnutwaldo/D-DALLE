import {ethers} from "hardhat";
import fs from 'fs';

// const CONTRACT_ADDRESS = '0x230a6C4727697CCDfF39c3b599DfAF2D6cb04fe2' // testnet
// Load contract address from deployment.json
const deployment = JSON.parse(fs.readFileSync('deployment.json', 'utf8'));
const CONTRACT_ADDRESS = deployment.address;

async function main() {
    const signers = await ethers.getSigners();
    const signer = signers[1];

    const factory = await ethers.getContractFactory("DDALLE");
    const contract = factory.attach(CONTRACT_ADDRESS);

    const numTasks = await contract.numTasks();
    console.log("Number of tasks:", numTasks.toString());

    for (let i = 0; i < numTasks.toNumber(); i += 1) {
        const page = await contract.getTasks(i);
        console.log(`Page ${i}:`, page);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
