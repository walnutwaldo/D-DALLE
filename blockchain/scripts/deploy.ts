import {ethers} from "hardhat";

async function main() {
    const KlaytnGreeter = await ethers.getContractFactory("KlaytnGreeter");
    const klaytnGreeter = await KlaytnGreeter.deploy("Hello, Klaytn!");

    await klaytnGreeter.deployed();

    console.log("KlaytnGreeter deployed to:", klaytnGreeter.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});