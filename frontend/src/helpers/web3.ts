import { apiGetGasPriceKlaytn, getChainData } from './utilities'
import { BigNumber } from "ethers";

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

// Wraps a read-only contract call (`.call()`) in a Promise.
function callContractMethod(contract: any, method: string, args: any[] = []) {
    return contract.methods[method](...args).call();
}

// Sends a state-changing transaction, estimating gas/gasPrice for Klaytn chains
// the same way across every write call.
function sendContractMethod(
    contract: any,
    method: string,
    args: any[],
    chainId: number,
    txParams: { from: string; value?: BigNumber }
): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const chain = getChainData(chainId).chain;
            const gasPrice = chain === 'klaytn' ? await apiGetGasPriceKlaytn(chainId) : undefined;
            const gas = chain === 'klaytn'
                ? await contract.methods[method](...args).estimateGas(txParams)
                : undefined;
            console.log(`sending ${method} transaction`);
            contract.methods[method](...args).send(
                { ...txParams, gas, gasPrice },
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

export function callMakeTask(
    address: string,
    chainId: number,
    description: string,
    duration: number,
    price: BigNumber,
    web3: any
) {
    return sendContractMethod(
        getDDALLEContract(web3, chainId),
        "makeTask",
        [description, duration],
        chainId,
        { from: address, value: price }
    );
}

export function callNumTasks(
    web3: any,
    chainId: number,
) {
    return callContractMethod(getDDALLEContract(web3, chainId), "numTasks");
}

export function callGetTasks(
    pageNumber: number,
    web3: any,
    chainId: number,
) {
    return callContractMethod(getDDALLEContract(web3, chainId), "getTasks", [pageNumber]);
}

export function callNumSubmissions(
    submissionsContract: string,
    web3: any
) {
    return callContractMethod(getSubmissionsContract(submissionsContract, web3), "numSubmissions");
}

export function callGetSubmissions(
    submissionsContract: string,
    pageNumber: number,
    web3: any
) {
    return callContractMethod(getSubmissionsContract(submissionsContract, web3), "getSubmissions", [pageNumber]);
}


export function callSubmit(
    address: string,
    chainId: number,
    submissionsContract: string,
    uri: string,
    prompt: string,
    web3: any
) {
    return sendContractMethod(
        getSubmissionsContract(submissionsContract, web3),
        "submit",
        [uri, prompt],
        chainId,
        { from: address }
    );
}

export function callAssignWinner(
    address: string,
    chainId: number,
    taskId: BigNumber,
    submissionId: BigNumber,
    web3: any
) {
    return sendContractMethod(
        getDDALLEContract(web3, chainId),
        "assignWinner",
        [taskId, submissionId],
        chainId,
        { from: address }
    );
}
