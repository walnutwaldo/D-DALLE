import {ethers} from "hardhat";
import {BigNumber} from "ethers";
import fs from "fs";

// Load contract address from deployment.json
const deployment = JSON.parse(fs.readFileSync('deployment.json', 'utf8'));
const CONTRACT_ADDRESS = deployment.address;
const TASK_ID = BigNumber.from("0");

const DDALLE_SUBMISSIONS_ARTIFACT_PATH = "./artifacts/contracts/DDALLESubmissions.Sol/DDALLESubmissions.json";
const DDALLE_SUBMISSIONS_ABI = JSON.parse(
    fs.readFileSync(DDALLE_SUBMISSIONS_ARTIFACT_PATH, "utf8")
)["abi"];

const URIs = [
    "https://openailabsprodscus.blob.core.windows.net/private/user-DTn6mhCmgGrt19ZLD5jBXc4L/generations/generation-EAOPCXlWfbHbAHvzDCheYl5N/image.webp?st=2022-09-25T00%3A14%3A40Z&se=2022-09-25T02%3A12%3A40Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/webp&skoid=15f0b47b-a152-4599-9e98-9cb4a58269f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2022-09-24T20%3A19%3A41Z&ske=2022-10-01T20%3A19%3A41Z&sks=b&skv=2021-08-06&sig=FuXZaPbUkGGYmT9AgXtUB5IzP5vjNmwGn2OQLGtrs0A%3D",
    "https://openailabsprodscus.blob.core.windows.net/private/user-DTn6mhCmgGrt19ZLD5jBXc4L/generations/generation-s5KNoIgjkH6EH086eSZaLS5p/image.webp?st=2022-09-25T00%3A12%3A44Z&se=2022-09-25T02%3A10%3A44Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/webp&skoid=15f0b47b-a152-4599-9e98-9cb4a58269f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2022-09-24T22%3A43%3A51Z&ske=2022-10-01T22%3A43%3A51Z&sks=b&skv=2021-08-06&sig=Y2BIZ2zqQPryMAbwFiMHwrLiirVRWspUL37z98NA4no%3D",
    "https://openailabsprodscus.blob.core.windows.net/private/user-DTn6mhCmgGrt19ZLD5jBXc4L/generations/generation-quAcoeP4E3jMXqXhz0gfoYWu/image.webp?st=2022-09-25T00%3A11%3A29Z&se=2022-09-25T02%3A09%3A29Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/webp&skoid=15f0b47b-a152-4599-9e98-9cb4a58269f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2022-09-24T19%3A34%3A00Z&ske=2022-10-01T19%3A34%3A00Z&sks=b&skv=2021-08-06&sig=1xjfHxqHrj9U%2BUxqFEbWrLW6o9j%2B0%2Brk5AYRXBeFupw%3D",
    "https://openailabsprodscus.blob.core.windows.net/private/user-DTn6mhCmgGrt19ZLD5jBXc4L/generations/generation-tnFLjTK8NCWLgWMFwu0rIC2M/image.webp?st=2022-09-25T00%3A08%3A07Z&se=2022-09-25T02%3A06%3A07Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/webp&skoid=15f0b47b-a152-4599-9e98-9cb4a58269f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2022-09-24T22%3A32%3A58Z&ske=2022-10-01T22%3A32%3A58Z&sks=b&skv=2021-08-06&sig=OEGrCdezjXmekgEPDz8PHthY1%2Bu4IX0ul2WfR2H2kLU%3D"
];

// const URI = "https://openailabsprodscus.blob.core.windows.net/private/user-DTn6mhCmgGrt19ZLD5jBXc4L/generations/generation-LN4LpixcFGd5ukJlDZ0dLEt6/image.webp?st=2022-09-24T15%3A41%3A57Z&se=2022-09-24T17%3A39%3A57Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/webp&skoid=15f0b47b-a152-4599-9e98-9cb4a58269f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2022-09-24T10%3A56%3A08Z&ske=2022-10-01T10%3A56%3A08Z&sks=b&skv=2021-08-06&sig=gQQ7r5VxB03dkf7H4dn58HlwmVge%2B0fePb41XwQEMzc%3D"

async function main() {
    const signers = await ethers.getSigners();
    const signer = signers[Math.min(signers.length - 1, 3)];

    const factory = await ethers.getContractFactory("DDALLE");
    const contract = factory.attach(CONTRACT_ADDRESS);

    const task = await contract.getTask(TASK_ID);
    const submissionsContract = new ethers.Contract(
        task.submissionsContract,
        DDALLE_SUBMISSIONS_ABI
    )

    console.log("Submitter address:", signer.address);
    for (const uri of URIs) {
        process.stdout.write(`Submitting to task ${TASK_ID} ... `);

        const txn = await submissionsContract.connect(signer).submit(
            uri,
            "prompt goes here",
        )

        const receipt = await txn.wait();
        console.log("DONE");

        const event = receipt.events?.filter((e: any) => e.event === "Transfer")[0];
        const submissionId = event!.args!.tokenId;
        console.log("Create submission ID:", submissionId.toString());
    }

    const allSubmissions = await submissionsContract.connect(signer).getSubmissions(0);
    console.log(`Page 1 of Submissions:`, allSubmissions.map((s: any) => ({
        owner: s.owner,
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
