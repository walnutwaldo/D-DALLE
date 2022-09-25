require('dotenv').config();
const ethers = require('ethers');

const { Wallet } = ethers;

const rpc_urls = {
    31337: 'http://localhost:8545',
    1001: process.env.BAOBAB_RPC_URL,
    8217: process.env.CYPRESS_RPC_URL,
}

const getSigner = async (chainId) => {
    const url = rpc_urls[chainId];
    // console.log("url", url);
    const provider = new ethers.providers.JsonRpcProvider(url);
    // console.log("Waiting for provider ...");
    await provider.ready;
    // console.log("READY");
    const result = await provider.send('eth_chainId', []);
    // console.log("provider chain id:", result);
    return new Wallet(process.env.SIGNER_KEY, provider);
}

module.exports = {
    getSigner
}