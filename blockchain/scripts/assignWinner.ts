import {ethers} from "hardhat";
import {BigNumber} from "ethers";
import fs from "fs";

// Load contract address from deployment.json
const deployment = JSON.parse(fs.readFileSync('deployment.json', 'utf8'));
const CONTRACT_ADDRESS = deployment.address;
const TASK_ID = BigNumber.from(deployment.taskId);

const WINNING_SUBMISSION = 1;

async function main() {
    // const signers = await ethers.getSigners();
    // const signer = signers[1];
    //
    // const factory = await ethers.getContractFactory("DDALLE");
    // const contract = factory.attach(CONTRACT_ADDRESS);
    //
    // console.log("Creator address:", signer.address);
    //
    // const winningSubmission = await contract.getSubmission(TASK_ID, WINNING_SUBMISSION);
    // const winningAddress = winningSubmission.owner;
    //
    // console.log(`Winning address:`, winningAddress);
    // console.log("Balance of winning address before:", (await ethers.provider.getBalance(winningAddress)).toString());
    //
    // process.stdout.write(`Assigning winner of ${TASK_ID} to be submission ${WINNING_SUBMISSION} ... `);
    //
    // const txn = await contract.connect(signer).assignWinner(
    //     TASK_ID,
    //     WINNING_SUBMISSION
    // );
    //
    // const receipt = await txn.wait();
    // console.log("DONE");
    //
    // console.log("Balance of winning address after:", (await ethers.provider.getBalance(winningAddress)).toString());
    //
    // const event = receipt.events?.filter((e) => e.event === "WinnerAssigned")[0];
    // const taskId = event!.args!.id;
    // const winner = event!.args!.winner;
    // console.log(`Assigned Winner of Task ${taskId.toString()}:`, winner.toString());
    //
    // console.log(`Winning Submission:`, {
    //     submitter: winningSubmission.submitter,
    //     uri: winningSubmission.uri,
    //     prompt: winningSubmission.prompt,
    // });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
