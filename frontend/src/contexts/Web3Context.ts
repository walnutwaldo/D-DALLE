import Web3 from "web3";
import React from "react";

type Web3Context = {
    web3: Web3 | null,
    setWeb3: (web3: Web3 | null) => void
    provider: any,
    setProvider: (provider: any) => void
    chainId: number,
    setChainId: (chainId: number) => void
    connected: boolean,
    setConnected: (connected: boolean) => void
    address: string,
    setAddress: (address: string) => void
    networkId: number
    setNetworkId: (networkId: number) => void
}

const DEFAULT_CONTEXT = {
    web3: null,
    setWeb3: () => {},
    provider: null,
    setProvider: () => {},
    chainId: 1,
    setChainId: () => {},
    connected: false,
    setConnected: () => {},
    address: "",
    setAddress: () => {},
    networkId: 1,
    setNetworkId: () => {}
}

const Web3Context = React.createContext<Web3Context>(DEFAULT_CONTEXT);

export default Web3Context;