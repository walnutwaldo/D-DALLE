import {ethers} from "hardhat";
import {attachDDALLE, findEvent, loadDeployment, runMain, saveDeployment} from "./utils";

// const CONTRACT_ADDRESS = '0x230a6C4727697CCDfF39c3b599DfAF2D6cb04fe2' // testnet
// Load contract address from deployment.json
const deployment = loadDeployment();
const CONTRACT_ADDRESS = deployment.address;

async function main() {
    const signers = await ethers.getSigners();
    const signer = signers[1];

    const contract = await attachDDALLE(CONTRACT_ADDRESS);

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

    const event = findEvent(receipt, "TaskCreated");
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
    saveDeployment(deployment);
}

runMain(main);
