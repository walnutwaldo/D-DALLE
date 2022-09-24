import ConnectWallet from "../web3/ConnectWallet";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';



function Header() {
    const location = useLocation();
    const onRequest = location.pathname === "/request";

    return (
        <header className='bg-slate-800 text-white py-2'>
            <div className={"h-96 flex flex-col text-center container mx-auto"}>
                <div className="flex flex-row justify-end align-baseline gap-4">
                    {!onRequest && <Link to={`request`} className={"p-2 text-gray-200 hover:text-white"}>
                        I need an image
                    </Link>
                    }
                    {onRequest && <Link to={`/`} className={"p-2 text-gray-200 hover:text-white"}>
                        I want to make images
                    </Link>
                    }
                    <ConnectWallet />
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
