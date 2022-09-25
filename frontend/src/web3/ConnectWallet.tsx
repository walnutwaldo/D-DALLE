import Web3Modal from "@klaytn/web3modal";
import {KaikasWeb3Provider} from "@klaytn/kaikas-web3-provider"
import React, {useContext, useEffect, useMemo} from "react";
import Web3 from "web3";
import {
    getChainData
} from "../helpers/utilities";
import {isHexString} from "ethereumjs-util";
import Web3Context from "../contexts/Web3Context";
import {DEFAULT_CHAIN_ID} from "../helpers/chains";


function ConnectWallet() {
    const {
        web3, setWeb3,
        provider, setProvider,
        chainId, setChainId,
        connected, setConnected,
        address, setAddress,
        networkId, setNetworkId,
        connectWallet, disconnectWallet,
    } = useContext(Web3Context);

    const addressShort = address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : "";

    return (
        <div>
            {
                !connected ? <button
                    className={
                        "bg-blue-500 px-2 py-1 rounded-md hover:bg-blue-400 transition"
                    }
                    onClick={connectWallet}
                >
                    Connect Wallet
                </button> : (
                    <div className={"flex flex-row items-baseline gap-1"}>
                        <div className={"py-1 px-2 bg-slate-800 bg-opacity-70 rounded-md"}>
                            {getChainData(chainId).name}
                        </div>
                        <div className={"font-mono p-1 bg-slate-800 bg-opacity-70 rounded-md"}>
                            {addressShort}
                        </div>
                        <button className={
                            "text-gray-200 bg-opacity-70 bg-slate-500 p-1 hover:text-white hover:bg-opacity-90 rounded-md transition"
                        } onClick={disconnectWallet}>
                            Disconnect
                        </button>
                    </div>
                )
            }
        </div>
    );
}

export default ConnectWallet;