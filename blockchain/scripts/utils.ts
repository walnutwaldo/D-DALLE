import {ethers} from "hardhat";
import {Contract} from "ethers";
import fs from "fs";

const DEPLOYMENT_FILE = "deployment.json";

// Loads the local deployment.json used by the task/submission scripts.
export function loadDeployment(): any {
    return JSON.parse(fs.readFileSync(DEPLOYMENT_FILE, "utf8"));
}

export function saveDeployment(deployment: any): void {
    fs.writeFileSync(DEPLOYMENT_FILE, JSON.stringify(deployment, null, 2));
}

// Reads the "abi" field out of a compiled Hardhat artifact.
export function loadArtifactAbi(artifactPath: string): any {
    return JSON.parse(fs.readFileSync(artifactPath, "utf8"))["abi"];
}

export async function attachDDALLE(address: string): Promise<Contract> {
    const factory = await ethers.getContractFactory("DDALLE");
    return factory.attach(address);
}

// Extracts the first event with the given name from a transaction receipt.
export function findEvent(receipt: any, eventName: string): any {
    return receipt.events?.filter((e: any) => e.event === eventName)[0];
}

// Shared entrypoint wrapper so every script handles async errors the same way.
export function runMain(main: () => Promise<void>): void {
    main().catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
}
