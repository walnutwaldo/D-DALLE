import {ethers} from "hardhat";

const CONTRACT_ADDRESS = '0x230a6C4727697CCDfF39c3b599DfAF2D6cb04fe2'

async function main() {
    const KlaytnGreeter = await ethers.getContractFactory("KlaytnGreeter");
    const klaytnGreeter = KlaytnGreeter.attach(CONTRACT_ADDRESS);

    const output = await klaytnGreeter.greet();

    console.log("Output:", output);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
