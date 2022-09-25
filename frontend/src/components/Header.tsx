import ConnectWallet from "../web3/ConnectWallet";
import {Link} from "react-router-dom";
import {useLocation} from 'react-router-dom';
import {useEffect, useState} from "react";

const useScrollPosition = () => {
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const updatePosition = () => {
            setScrollPosition(window.pageYOffset);
        }
        window.addEventListener("scroll", updatePosition);
        updatePosition();
        return () => window.removeEventListener("scroll", updatePosition);
    }, []);

    return scrollPosition;
};

function Header() {
    const location = useLocation();
    const onRequest = location.pathname === "/request";
    const onMain = location.pathname === "/";

    const scrollPosition = useScrollPosition();

    return (
        <header className='text-white py-2 relative'>
            <div
                className={"absolute top-0 bottom-0 -z-10 overflow-hidden overflow-hidden"}
            >
                <img src="/banner.png" alt="" className={"object-cover min-h-full w-full"} style={{
                    transform: `translateY(${Math.max(0, scrollPosition/3)}px)`
                }}/>
            </div>
            <div className={"h-96 flex flex-col text-center container mx-auto justify-between"}>
                <div className="flex flex-row justify-end items-baseline gap-4 my-2">
                    <ConnectWallet/>
                </div>
                <div className={""}>
                    <h1 className='text-8xl text-center serif'>D-DALLE</h1>
                    <h3 className='text-xl text-center'>Decentralized AI Art - Bringing together the world's creativity</h3>
                </div>
                <div className={"flex flex-row gap-4 justify-center mb-4"}>
                    <Link to={`/`} className={"p-2 w-48" + (onMain ? " font-bold text-white cursor-default" : " text-gray-200 hover:text-white")}>
                        See All Bounties
                    </Link>
                    <Link to={`/request`} className={"p-2 w-48" + (onRequest ? " font-bold text-white cursor-default" : " text-gray-200 hover:text-white")}>
                        Create A Bounty
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;
