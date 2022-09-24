import {ethers} from "hardhat";
import {BigNumber} from "ethers";
import fs from "fs";

// Load contract address from deployment.json
const deployment = JSON.parse(fs.readFileSync('deployment.json', 'utf8'));
const CONTRACT_ADDRESS = deployment.address;
const TASK_ID = BigNumber.from(deployment.taskId);
const URI = "test uri";
// const URI = "https://openailabsprodscus.blob.core.windows.net/private/user-DTn6mhCmgGrt19ZLD5jBXc4L/generations/generation-LN4LpixcFGd5ukJlDZ0dLEt6/image.webp?st=2022-09-24T15%3A41%3A57Z&se=2022-09-24T17%3A39%3A57Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/webp&skoid=15f0b47b-a152-4599-9e98-9cb4a58269f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2022-09-24T10%3A56%3A08Z&ske=2022-10-01T10%3A56%3A08Z&sks=b&skv=2021-08-06&sig=gQQ7r5VxB03dkf7H4dn58HlwmVge%2B0fePb41XwQEMzc%3D"

async function main() {
    const signers = await ethers.getSigners();
    const signer = signers[3];

    const factory = await ethers.getContractFactory("DDALLE");
    const contract = factory.attach(CONTRACT_ADDRESS);

    console.log("Submitter address:", signer.address);
    process.stdout.write(`Submitting to take ${TASK_ID} ... `);

    const txn = await contract.connect(signer).submit(
        TASK_ID,
        URI,
        "submission 1"
        // "a cute koala cowboy astronaut floating among sea of stars, digital art"
    )

    const receipt = await txn.wait();
    console.log("DONE");

    const event = receipt.events?.filter((e) => e.event === "SubmissionCreated")[0];
    const taskId = event!.args!.id;
    console.log("Submitted to Task ID:", taskId.toString());

    const allSubmissions = await contract.getSubmissions(taskId, 0);
    console.log(`All Submissions:`, allSubmissions.map((s) => ({
        submitter: s.submitter,
        uri: s.uri,
        prompt: s.prompt,
    })));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
