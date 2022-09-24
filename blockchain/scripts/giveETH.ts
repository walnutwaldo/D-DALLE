import {ethers} from "hardhat";
import fs from 'fs';

const RECEIVER = "0xd84365dAd6e6dB6fa2d431992acB1e050789bE69";

async function main() {
    const signers = await ethers.getSigners();
    const signer = signers[0];
    const tx = await signer.sendTransaction({
        to: RECEIVER,
        value: ethers.utils.parseEther("100.0"),
    });
    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    console.log("Transaction mined");

    // Get balance of RECEIVER
    const balance = await ethers.provider.getBalance(RECEIVER);
    console.log("Balance:", ethers.utils.formatEther(balance));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
