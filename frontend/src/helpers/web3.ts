import { KIP7_CONTRACT } from '../constants'
import { apiGetGasPriceKlaytn, apiGetGasPrices, getChainData } from './utilities'
import {ethers} from "ethers";

export function getKIP7Contract(web3: any, contractAddress: any) {
    const tokenContract = new ethers.Contract(contractAddress, KIP7_CONTRACT.abi);
    return tokenContract;
}

export function callBalanceOf(address: string, chainId: number, contractAddress: string, web3: any) {
    return new Promise(async(resolve, reject) => {
        try{
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
        } catch(err) {
            reject(err)
        }
    })
}

export function callTransfer(address: string, chainId: number, contractAddress: string, web3: any) {
    return new Promise(async(resolve, reject) => {
        try {
            const contract = getKIP7Contract(web3, contractAddress)
            const chain = getChainData(chainId).chain
            const gasPrice = chain === 'klaytn' ? await apiGetGasPriceKlaytn(chainId) : undefined;
            const gas = chain === 'klaytn'
                ? await contract.methods.transfer(address, '1').estimateGas({from: address})
                : undefined;
            await contract.methods
            .transfer(address, '1')
            .send({ from: address, gas: gas, gasPrice: gasPrice}, (err: any, data: any) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        } catch(err) {
            reject(err)
        }
    })
}
