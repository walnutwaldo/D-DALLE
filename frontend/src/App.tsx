import React from 'react';
import './App.css';
import Web3 from "web3";
import Web3Context from './contexts/Web3Context';
import PageContext, { GlobalData } from "./contexts/PageContext";
import Body from './components/Body';
import { BountyT } from './types.tsx/types';
import toy_data from './constants/toy_data';



import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
} from "react-router-dom";
import Bounties from './components/Bounties';
import Requesting from './components/Requesting';
import BountyPage from './components/BountyPage';




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


function App() {
    const [web3, setWeb3] = React.useState<Web3 | null>(null);
    const [provider, setProvider] = React.useState<any>(null);
    const [chainId, setChainId] = React.useState(1);
    const [connected, setConnected] = React.useState(false);
    const [address, setAddress] = React.useState("");
    const [networkId, setNetworkId] = React.useState(1);
    const [bounty_data, setBountyData] = React.useState(toy_data as BountyT[]);

    const globalData = {
        bounties: bounty_data
    };
    const setGlobalData = (globalData: GlobalData) => {
        setBountyData(globalData.bounties);
    };

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
                <RouterProvider router={router} />
            </PageContext.Provider>
        </Web3Context.Provider>
    );
}

export default App;
