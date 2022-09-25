import { KIP7_CONTRACT } from '../constants'
import { apiGetGasPriceKlaytn, apiGetGasPrices, getChainData } from './utilities'
import { BigNumber, ethers } from "ethers";

export const DDALLE_DEPLOYMENT = require('../constants/DDALLE_DEPLOYMENT.json');

export function getDDALLEContract(web3: any, chainId: number) {
    // We have to pass in chainId and not just do this:
    // const chainId = Number(web3.currentProvider.chainId);
    // because chainId is not available in the provider object sometimes

    const address = DDALLE_DEPLOYMENT.address[chainId];
    console.log("chainId:", chainId);
    console.log("DDALLE contract address:", address);
    const contract = new web3.eth.Contract(
        DDALLE_DEPLOYMENT.abi,
        address
    );
    return contract;
}

export function getSubmissionsContract(address: string, web3: any) {
    const contract = new web3.eth.Contract(
        DDALLE_DEPLOYMENT.submissions_abi,
        address
    );
    return contract;
}

export function callMakeTask(
    address: string,
    chainId: number,
    description: string,
    duration: number,
    price: BigNumber,
    web3: any
) {
    return new Promise(async (resolve, reject) => {
        try {
            const contract = getDDALLEContract(web3, chainId);
            const chain = getChainData(chainId).chain;
            const gasPrice = chain === 'klaytn' ? await apiGetGasPriceKlaytn(chainId) : undefined;
            const gas = chain === 'klaytn'
                ? await contract.methods.makeTask(description, duration).estimateGas({ from: address, value: price })
                : undefined;
            console.log("sending makeTask transaction");
            await contract.methods
                .makeTask(description, duration)
                .send(
                    { from: address, gas: gas, gasPrice: gasPrice, value: price },
                    (err: any, data: any) => {
                        if (err) {
                            reject(err)
                        }
                        resolve(data)
                    }
                )
        } catch (err) {
            reject(err)
        }
    });
}

export function callNumTasks(
    web3: any,
    chainId: number,
) {
    return new Promise(async (resolve, reject) => {
        try {
            const contract = getDDALLEContract(web3, chainId);
            const tasks = await contract.methods.numTasks().call();
            resolve(tasks);
        } catch (err) {
            reject(err)
        }
    });
}

export function callGetTasks(
    pageNumber: number,
    web3: any,
    chainId: number,
) {
    return new Promise(async (resolve, reject) => {
        try {
            const contract = getDDALLEContract(web3, chainId);
            const tasks = await contract.methods.getTasks(pageNumber).call();
            resolve(tasks);
        } catch (err) {
            reject(err)
        }
    });
}

export function callNumSubmissions(
    submissionsContract: string,
    web3: any
) {
    return new Promise(async (resolve, reject) => {
        try {
            const contract = getSubmissionsContract(submissionsContract, web3);
            const tasks = await contract.methods.numSubmissions().call();
            resolve(tasks);
        } catch (err) {
            reject(err)
        }
    });
}

export function callGetSubmissions(
    submissionsContract: string,
    pageNumber: number,
    web3: any
) {
    return new Promise(async (resolve, reject) => {
        try {
            const contract = getSubmissionsContract(submissionsContract, web3);
            const submissions = await contract.methods.getSubmissions(pageNumber).call();
            resolve(submissions);
        } catch (err) {
            reject(err)
        }
    });
}


export function callSubmit(
    address: string,
    chainId: number,
    submissionsContract: string,
    uri: string,
    prompt: string,
    web3: any
) {
    return new Promise(async (resolve, reject) => {
        try {
            const contract = getSubmissionsContract(submissionsContract, web3);
            const chain = getChainData(chainId).chain;
            const gasPrice = chain === 'klaytn' ? await apiGetGasPriceKlaytn(chainId) : undefined;
            const gas = chain === 'klaytn'
                ? await contract.methods.submit(uri, prompt).estimateGas({ from: address })
                : undefined;
            console.log("sending submit transaction");
            await contract.methods
                .submit(uri, prompt)
                .send(
                    { from: address, gas: gas, gasPrice: gasPrice },
                    (err: any, data: any) => {
                        if (err) {
                            reject(err)
                        }
                        resolve(data)
                    }
                )
        } catch (err) {
            reject(err)
        }
    });
}