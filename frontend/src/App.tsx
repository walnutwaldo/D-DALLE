import React, {useCallback, useEffect, useMemo} from 'react';
import './App.css';
import Web3 from "web3";
import Web3Context from './contexts/Web3Context';
import Body from './components/Body';
import {BountyT} from './types.tsx/types';

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Bounties from './components/Bounties';
import Requesting from './components/Requesting';
import BountyPage from './components/BountyPage';
import {callGetTasks, callNumTasks, DDALLE_DEPLOYMENT} from "./helpers/web3";
import {BigNumber} from "ethers";
import GlobalDataContext, {GlobalData} from "./contexts/GlobalDataContext";
import {getChainData} from "./helpers/utilities";
import {DEFAULT_CHAIN_ID} from "./helpers/chains";

import Web3Modal from "@klaytn/web3modal";
import {isHexString} from "ethereumjs-util";
import {KaikasWeb3Provider} from "@klaytn/kaikas-web3-provider";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Body/>,
        children: [
            {
                path: "/",
                element: <Bounties/>,
            },
            {
                path: "request",
                element: <Requesting/>,
            },
            {
                path: "propose/:id",
                element: <BountyPage/>,
            },
        ]
    },
]);

const PROVIDER_OPTIONS = {
    kaikas: {
        package: KaikasWeb3Provider,
    }
}

let switchingChains = false;

function Web3ContextProvider(props: any) {
    const {children} = props;
    const [web3, setWeb3] = React.useState<Web3 | null>(null);
    const [provider, setProvider] = React.useState<any>(null);
    const [chainId, setChainId] = React.useState(DEFAULT_CHAIN_ID);
    const [connected, setConnected] = React.useState(false);
    const [address, setAddress] = React.useState("");
    const [networkId, setNetworkId] = React.useState(DEFAULT_CHAIN_ID);

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

    const disconnectWallet = useCallback(
        async () => {
            if (provider && provider.close) {
                await provider.close();
            }
            await web3Modal.clearCachedProvider();

            setWeb3(null);
            setProvider(null);
            setChainId(DEFAULT_CHAIN_ID);
            setNetworkId(DEFAULT_CHAIN_ID);
            setConnected(false);
            setAddress("");
        },
        [provider, web3Modal, setWeb3, setProvider, setChainId, setNetworkId, setConnected, setAddress]
    );

    const subscribeProvider = useCallback(
        async (provider: any) => {
            if (!provider.on) {
                return;
            }
            provider.on("close", disconnectWallet);
            provider.on("accountsChanged", async (accounts: any) => {
                setAddress(accounts[0]);
            });
            provider.on("chainChanged", async (chainId: any) => {
                chainId = isHexString(chainId) ? Number(chainId).toString() : chainId;
                setChainId(Number(chainId));
                const networkId = chainId;
                setNetworkId(networkId!);
            });
            provider.on("networkChanged", async (networkId: any) => {
                const chainId = networkId;
                setChainId(Number(chainId));
                setNetworkId(networkId);
            });
        },
        [disconnectWallet, setAddress, setChainId, setNetworkId, web3]
    );

    const connectWallet = useCallback(
        async () => {
            const provider = await web3Modal.connect();
            setProvider(provider);

            await subscribeProvider(provider);

            await provider.enable();
            const web3 = initWeb3(provider);
            setWeb3(web3);

            const accounts = await web3.eth.getAccounts();

            const address = accounts[0];
            setAddress(address);

            const networkId = await web3.eth.net.getId();
            setNetworkId(networkId);

            const chainId = await web3.eth.getChainId();
            setChainId(Number(chainId));
            console.log('connecting to chainId:', chainId);

            setConnected(true);

            if (!DDALLE_DEPLOYMENT.address[Number(chainId)] && !switchingChains) {
                switchingChains = true;
                const newChain = '0x' + DEFAULT_CHAIN_ID.toString(16);
                let req;
                try {
                    req = await provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{chainId: newChain}],
                    });
                } catch (switchError: any) {
                    // This error code indicates that the chain has not been added to MetaMask.
                    if (switchError.code === 4902) {
                        try {
                            const chainData = getChainData(DEFAULT_CHAIN_ID);
                            req = await provider.request({
                                method: 'wallet_addEthereumChain',
                                params: [
                                    {
                                        chainId: newChain,
                                        chainName: chainData.name,
                                        nativeCurrency: {
                                            name: chainData.native_currency.name,
                                            symbol: chainData.native_currency.symbol,
                                            decimals: 18
                                        },
                                        rpcUrls: [chainData.rpc_url]
                                    }
                                ],
                            });
                        } catch (addError) {
                            // handle "add" error
                        }
                    }
                }
                connectWallet().then();
                switchingChains = false;
            }
        },
        [setProvider, subscribeProvider, setWeb3, setAddress, setNetworkId, setChainId, setConnected]
    );

    useEffect(() => {
        if (web3Modal.cachedProvider) {
            connectWallet().then();
        }
    }, []);

    return (
        <Web3Context.Provider value={{
            web3,
            setWeb3,
            provider,
            setProvider,
            chainId,
            setChainId,
            connected,
            setConnected,
            address,
            setAddress,
            networkId,
            setNetworkId,
            connectWallet,
            disconnectWallet,
        }}>
            {children}
        </Web3Context.Provider>
    )
}

let bountyRefreshCnt = 0;

function GlobalDataProvider(props: any) {
    const {children} = props;

    const [bounty_data, setBountyData] = React.useState<BountyT[]>([]);

    const globalData = {
        bounties: bounty_data
    };


    const {web3, provider, chainId, connected, networkId} = React.useContext(Web3Context);

    const setGlobalData = (globalData: GlobalData) => {
        setBountyData(globalData.bounties);
    };

    async function refreshBountyDataWithWeb3(web3: Web3, chainId: number) {
        console.log("refreshing chain", chainId);
        const currBountyCnt = ++bountyRefreshCnt;
        callNumTasks(web3, chainId)
            .then((num_tasks: any) => {
                if (BigNumber.from(num_tasks).gt(0)) {
                    return callGetTasks(0, web3, chainId);
                } else {
                    return [];
                }
            })
            .then((tasks: any) => {
                const newBountyData = tasks.map((task: any) => {
                    const {
                        id,
                        description,
                        bounty,
                        deadline,
                        completed,
                        owner,
                        winner
                    } = task;
                    return {
                        id,
                        owner,
                        bounty: BigNumber.from(bounty),
                        deadline: Number(deadline),
                        description,
                        completed,
                        winner
                    }
                });
                if (currBountyCnt === bountyRefreshCnt) {
                    setBountyData(newBountyData);
                }
            });
    }

    async function refreshBountyData() {
        if (chainId) {
            if (connected && web3) {
                refreshBountyDataWithWeb3(web3, chainId).then();
            } else {
                const web3 = new Web3(
                    getChainData(chainId).rpc_url
                );
                refreshBountyDataWithWeb3(web3, chainId).then()
            }
        }
    }

    useEffect(() => {
        refreshBountyData().then();
    }, [web3, provider, chainId, connected, networkId])

    return (
        <GlobalDataContext.Provider value={{
            globalData, setGlobalData
        }}>
            {children}
        </GlobalDataContext.Provider>
    )
}

function App() {
    const [bounty_data, setBountyData] = React.useState<BountyT[]>([]);

    return (
        <Web3ContextProvider>
            <GlobalDataProvider>
                <RouterProvider router={router}/>
            </GlobalDataProvider>
        </Web3ContextProvider>
    );
}

export default App;
