import React, {useContext} from 'react';
import ConnectWallet from "../web3/ConnectWallet";
import PageContext, {PageType} from "../contexts/PageContext";

function Header() {
    const {page, setPage} = useContext(PageContext);

    function togglePage() {
        if (page === PageType.Propose) {
            setPage(PageType.Request);
        } else {
            setPage(PageType.Propose);
        }
    }

    return (
        <header className='bg-slate-800 text-white py-2'>
            <div className={"h-96 flex flex-col text-center container mx-auto"}>
                <div className="flex flex-row justify-end items-baseline gap-4">
                    <button className={"p-2 text-gray-200 hover:text-white"} onClick={togglePage}>
                        {
                            page === PageType.Propose ?
                                "I need an image" :
                                "I want to make images"
                        }
                    </button>
                    <ConnectWallet/>
                </div>
                <div className={"my-auto"}>
                    <h1 className='text-8xl text-center'>D-DALLE</h1>
                    <h3 className='text-xl text-center'>Decentralized AI image generation.</h3>
                </div>
            </div>
        </header>
    );
}

export default Header;
