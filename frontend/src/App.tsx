import React from 'react';
import './App.css';
import Header from './components/Header';
import Bounties from './components/Bounties';
import Footer from './components/Footer';
import Web3 from "web3";
import Web3Context from './contexts/Web3Context';

function App() {
    const [web3, setWeb3] = React.useState<Web3 | null>(null);
    const [provider, setProvider] = React.useState<any>(null);
    const [chainId, setChainId] = React.useState(1);
    const [connected, setConnected] = React.useState(false);
    const [address, setAddress] = React.useState("");
    const [networkId, setNetworkId] = React.useState(1);

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
            <div>
                <Header/>
                <Bounties/>
                <Footer/>
            </div>
        </Web3Context.Provider>
    );
}

export default App;
