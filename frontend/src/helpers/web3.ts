import { KIP7_CONTRACT } from '../constants'
import { apiGetGasPriceKlaytn, apiGetGasPrices, getChainData } from './utilities'
import { BigNumber, ethers } from "ethers";

const DDALLE_DEPLOYMENT = require('../constants/DDALLE_DEPLOYMENT.json');

export function getKIP7Contract(web3: any, contractAddress: any) {
    const tokenContract = new web3.eth.Contract(
        KIP7_CONTRACT.abi,
        contractAddress
    );
    return tokenContract;
}

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

export function callBalanceOf(address: string, chainId: number, contractAddress: string, web3: any) {
    return new Promise(async (resolve, reject) => {
        try {
            const contract = getKIP7Contract(web3, contractAddress)

            await contract.methods
                .balanceOf(address)
                .call(
                    { from: '0x0000000000000000000000000000000000000000' },
                    (err: any, data: any) => {
                        if (err) {
                            console.log('err', err)
                            reject(err)
                        }
                        resolve(data)
                    }
                )
        } catch (err) {
            reject(err)
        }
    })
}

export function callTransfer(address: string, chainId: number, contractAddress: string, web3: any) {
    return new Promise(async (resolve, reject) => {
        try {
            const contract = getKIP7Contract(web3, contractAddress)
            const chain = getChainData(chainId).chain
            const gasPrice = chain === 'klaytn' ? await apiGetGasPriceKlaytn(chainId) : undefined;
            const gas = chain === 'klaytn'
                ? await contract.methods.transfer(address, '1').estimateGas({ from: address })
                : undefined;
            await contract.methods
                .transfer(address, '1')
                .send({ from: address, gas: gas, gasPrice: gasPrice }, (err: any, data: any) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(data)
                })
        } catch (err) {
            reject(err)
        }
    })
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
    taskId: any,
    web3: any,
    chainId: number,
) {
    return new Promise(async (resolve, reject) => {
        try {
            const contract = getDDALLEContract(web3, chainId);
            const tasks = await contract.methods.numSubmissions(taskId).call();
            resolve(tasks);
        } catch (err) {
            reject(err)
        }
    });
}

export function callGetSubmissions(
    taskId: any,
    pageNumber: number,
    web3: any,
    chainId: number,
) {
    return new Promise(async (resolve, reject) => {
        try {
            const contract = getDDALLEContract(web3, chainId);
            const submissions = await contract.methods.getSubmissions(taskId, pageNumber).call();
            resolve(submissions);
        } catch (err) {
            reject(err)
        }
    });
}


export function callSubmit(
    address: string,
    chainId: number,
    taskId: BigNumber,
    uri: string,
    prompt: string,
    web3: any
) {
    return new Promise(async (resolve, reject) => {
        try {
            const contract = getDDALLEContract(web3, chainId);
            const chain = getChainData(chainId).chain;
            const gasPrice = chain === 'klaytn' ? await apiGetGasPriceKlaytn(chainId) : undefined;
            const gas = chain === 'klaytn'
                ? await contract.methods.submit(taskId, uri, prompt).estimateGas({ from: address })
                : undefined;
            console.log("sending submit transaction");
            await contract.methods
                .submit(taskId, uri, prompt)
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

export function callAssignWinner(
    address: string,
    chainId: number,
    taskId: BigNumber,
    submissionId: BigNumber,
    web3: any
) {
    return new Promise(async (resolve, reject) => {
        try {
            const contract = getDDALLEContract(web3, chainId);
            const chain = getChainData(chainId).chain;
            const gasPrice = chain === 'klaytn' ? await apiGetGasPriceKlaytn(chainId) : undefined;
            const gas = chain === 'klaytn'
                ? await contract.methods.assignWinner(taskId, submissionId).estimateGas({ from: address })
                : undefined;
            console.log("sending assignWinner transaction");
            await contract.methods
                .assignWinner(taskId, submissionId)
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