import React, {useEffect} from 'react';
import './App.css';
import Web3 from "web3";
import Web3Context from './contexts/Web3Context';
import PageContext, {GlobalData} from "./contexts/PageContext";
import Body from './components/Body';
import {BountyT} from './types.tsx/types';

import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
} from "react-router-dom";
import Bounties from './components/Bounties';
import Requesting from './components/Requesting';
import BountyPage from './components/BountyPage';
import {callGetTasks, callNumTasks} from "./helpers/web3";
import {BigNumber} from "ethers";


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


function App() {
    const [web3, setWeb3] = React.useState<Web3 | null>(null);
    const [provider, setProvider] = React.useState<any>(null);
    const [chainId, setChainId] = React.useState(1);
    const [connected, setConnected] = React.useState(false);
    const [address, setAddress] = React.useState("");
    const [networkId, setNetworkId] = React.useState(1);
    const [bounty_data, setBountyData] = React.useState<BountyT[]>([]);

    const globalData = {
        bounties: bounty_data
    };

    const setGlobalData = (globalData: GlobalData) => {
        setBountyData(globalData.bounties);
    };

    async function refreshBountyData() {
        if (connected && web3) {
            callNumTasks(web3)
                .then((num_tasks: any) => {
                    if (BigNumber.from(num_tasks).gt(0)) {
                        return callGetTasks(0, web3);
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
        } else {
            // Gotta implement this case
        }
    }

    useEffect(() => {
        refreshBountyData().then();
    }, [web3, provider, chainId, connected, networkId])

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

            <PageContext.Provider value={{
                globalData, setGlobalData
            }}>
                <RouterProvider router={router}/>
            </PageContext.Provider>
        </Web3Context.Provider>
    );
}

export default App;
