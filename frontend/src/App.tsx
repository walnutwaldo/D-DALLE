import React, { useEffect } from 'react';
import './App.css';
import Web3 from "web3";
import Web3Context from './contexts/Web3Context';
import Body from './components/Body';
import { BountyT } from './types.tsx/types';

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Bounties from './components/Bounties';
import Requesting from './components/Requesting';
import BountyPage from './components/BountyPage';
import { callGetTasks, callNumTasks } from "./helpers/web3";
import { BigNumber } from "ethers";
import GlobalDataContext, { GlobalData } from "./contexts/GlobalDataContext";
import { getChainData } from "./helpers/utilities";
import { DEFAULT_CHAIN_ID } from "./helpers/chains";
import { isFunctionOrConstructorTypeNode } from 'typescript';


const router = createBrowserRouter([
    {
        path: "/",
        element: <Body />,
        children: [
            {
                path: "/",
                element: <Bounties />,
            },
            {
                path: "request",
                element: <Requesting />,
            },
            {
                path: "propose/:id",
                element: <BountyPage />,
            },
        ]
    },
]);

function Web3ContextProvider(props: any) {
    const { children } = props;
    const [web3, setWeb3] = React.useState<Web3 | null>(null);
    const [provider, setProvider] = React.useState<any>(null);
    const [chainId, setChainId] = React.useState(DEFAULT_CHAIN_ID);
    const [connected, setConnected] = React.useState(false);
    const [address, setAddress] = React.useState("");
    const [networkId, setNetworkId] = React.useState(DEFAULT_CHAIN_ID);

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
            setNetworkId
        }}>
            {children}
        </Web3Context.Provider>
    )
}

function GlobalDataProvider(props: any) {
    const { children } = props;

    const [bounty_data, setBountyData] = React.useState<BountyT[]>([]);

    const globalData = {
        bounties: bounty_data
    };


    const { web3, provider, chainId, connected, networkId } = React.useContext(Web3Context);

    const setGlobalData = (globalData: GlobalData) => {
        setBountyData(globalData.bounties);
    };

    useEffect(() => {
        refreshBountyData().then();
    }, [web3, provider, chainId, connected, networkId])

    async function refreshBountyDataWithWeb3(web3: Web3, chainId: number) {
        callNumTasks(web3, chainId)
            .then((num_tasks: any) => {
                if (BigNumber.from(num_tasks).gt(0)) {
                    return callGetTasks(0, web3, chainId);
                } else {
                    return [];
                }
            })
            .then((tasks: any) => {
                setBountyData(tasks.map((task: any) => {
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
                }))
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
                <RouterProvider router={router} />
            </GlobalDataProvider>
        </Web3ContextProvider>
    );
}

export default App;
