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

    console.log("Creator address:", signer.address);
    console.log("Creator starting balance:", (await signer.getBalance()).toString());
    process.stdout.write("Making Task ... ");

    const txn = await contract.connect(signer).makeTask(
        "A koala wearing a cute hat in space",
        1,
        {
            value: ethers.utils.parseEther("10"),
        }
    )

    const receipt = await txn.wait();
    console.log("DONE");

    console.log("Creator end balance:", (await signer.getBalance()).toString());

    const event = receipt.events?.filter((e) => e.event === "TaskCreated")[0];
    const taskId = event!.args!.id;
    console.log("Task ID:", taskId.toString());

    const task = await contract.tasks(taskId);

    console.log(`Made Task:`, {
        id: task.id.toString(),
        description: task.description,
        bounty: task.bounty.toString(),
        owner: task.owner,
    });

    // Update taskId in deployment.json
    deployment.taskId = taskId.toString();
    fs.writeFileSync('deployment.json', JSON.stringify(deployment, null, 2));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
