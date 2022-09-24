import React from 'react';
import ConnectWallet from "../web3/ConnectWallet";

function Header() {
    return (
        <header className='bg-slate-800 text-white h-96 flex flex-col text-center'>
            <div className={"my-auto"}>
                <h1 className='text-8xl text-center'>D-DALLE</h1>
                <h3 className='text-xl text-center'>Decentralized AI image generation.</h3>
                <ConnectWallet/>
            </div>
        </header>
    );
}

export default Header;
