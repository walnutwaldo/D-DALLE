import Web3Modal from "@klaytn/web3modal";
import {KaikasWeb3Provider} from "@klaytn/kaikas-web3-provider"
import React, {useContext, useEffect, useMemo} from "react";
import Web3 from "web3";
import {
    getChainData
} from "../helpers/utilities";
import {isHexString} from "ethereumjs-util";
import Web3Context from "../contexts/Web3Context";

const PROVIDER_OPTIONS = {
    kaikas: {
        package: KaikasWeb3Provider,
    }
}

function ConnectWallet() {
    const {
        web3, setWeb3,
        provider, setProvider,
        chainId, setChainId,
        connected, setConnected,
        address, setAddress,
        networkId, setNetworkId
    } = useContext(Web3Context);

    function getNetwork() {
        return getChainData(chainId).network;
    }

    const web3Modal = useMemo(() => new Web3Modal({
        network: getNetwork(),
        cacheProvider: true,
        providerOptions: PROVIDER_OPTIONS
    }), []);

    function initWeb3(provider: any) {
        const web3 = new Web3(provider);
        return web3;
    }

    async function subscribeProvider(provider: any) {
        if (!provider.on) {
            return;
        }
        provider.on("close", disconnect);
        provider.on("accountsChanged", async (accounts: any) => {
            setAddress(accounts[0]);
        });
        provider.on("chainChanged", async (chainId: any) => {
            const networkId = await web3?.eth.net.getId();
            chainId = isHexString(chainId)? Number(chainId).toString():chainId;
            setChainId(Number(chainId));
            setNetworkId(networkId!);
        });
        provider.on("networkChanged", async (networkId: any) => {
            const chainId = await web3?.eth.getChainId();
            setChainId(Number(chainId));
            setNetworkId(networkId);
        });
    }

    async function connectWallet() {
        const provider = await web3Modal.connect();
        setProvider(provider);

        await subscribeProvider(provider);

        await provider.enable();
        const web3 = initWeb3(provider);
        setWeb3(web3);

        const accounts = await web3.eth.getAccounts();
        console.log("Accounts: ", accounts);

        const address = accounts[0];
        console.log("Address: ", address);
        setAddress(address);

        const networkId = await web3.eth.net.getId();
        setNetworkId(networkId);

        const chainId = await web3.eth.getChainId();
        setChainId(Number(chainId));

        setConnected(true);
    }

    async function disconnect() {
        if (provider && provider.close) {
            await provider.close();
        }
        await web3Modal.clearCachedProvider();
        setProvider(null);
        setChainId(1);
        setConnected(false);
    }

    useEffect(() => {
        if (web3Modal.cachedProvider) {
            connectWallet().then();
        }
    }, []);

    return (
        <div>
            {!connected ? <button
                className={
                    "bg-blue-500 p-2 rounded-md text-lg mt-2"
                }
                onClick={connectWallet}
            >
                Connect Wallet
            </button> : <button className={
                "text-gray-200 p-2 text-md mt-2 hover:text-white"
            } onClick={disconnect}>
                Disconnect
            </button>}
        </div>
    );
}

export default ConnectWallet;