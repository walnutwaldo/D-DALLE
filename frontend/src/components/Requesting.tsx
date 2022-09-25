import React, {useContext, useEffect, useState} from "react";
import Web3Context from "../contexts/Web3Context";
import {BigNumber, ethers} from "ethers";
import {callMakeTask} from "../helpers/web3";
import {getChainData} from "../helpers/utilities";

function Requesting() {
    const {connected, web3, address, networkId, chainId} = useContext(Web3Context);

    const [priceValue, setPriceValue] = useState("0");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState("0");

    const [editingPrice, setEditingPrice] = useState(false);
    const [editingDuration, setEditingDuration] = useState(false);
    const [weiBalance, setWeiBalance] = useState("0");

    const priceRef = React.createRef<HTMLInputElement>();
    const durationRef = React.createRef<HTMLInputElement>();

    function refreshEditingPrice() {
        setEditingPrice(document.activeElement === priceRef?.current);
    }

    function refreshEditingDuration() {
        setEditingDuration(document.activeElement === durationRef?.current);
    }

    function sendRequest() {
        callMakeTask(
            address,
            chainId,
            description,
            Number(duration),
            ethers.utils.parseEther(priceValue),
            web3
        ).then((res) => {
            console.log("Result: ", res);
        });
        setDescription("");
        setPriceValue("0");
        setDuration("0");
    }

    useEffect(() => {
        if (web3 && address) {
            web3.eth.getBalance(address).then((weiBalance) => {
                console.log("weiBalance", weiBalance);
                setWeiBalance(weiBalance);
            });
        }
    }, [web3, address, connected, chainId, networkId]);

    const ethBalance = ethers.utils.formatEther(weiBalance);

    const enablePosting = ethers.utils.parseEther(priceValue).gt(BigNumber.from(0))
        && description.length > 10
        && Number(duration) > 0;

    const chainData = getChainData(chainId);
    const currencyTicker = chainData.native_currency.symbol;

    return connected ? (
        <div className={"w-1/2 mx-auto flex flex-col gap-2"}>
            <h3 className={"text-lg font-bold"}>Request an Image</h3>
            <div>
                <label className={"font-semibold"}>Description</label> (min 10 chars)
                <textarea
                    className={"w-full h-32 border border-gray-300 rounded-md p-2"}
                    value={description}
                    onInput={(e) => {
                        setDescription(e.currentTarget.value);
                    }}
                />
            </div>
            <div>
                <span className={"flex flex-row justify-between"}>
                    <label className={"font-semibold"}>Bounty</label>
                    <span className={"text-gray-600"}>
                        Available Balance: {ethBalance}
                    </span>
                </span>
                <span
                    className={"flex flex-row items-baseline gap-2 rounded-md border bg-white" + (
                        editingPrice ? " outline outline-2 outline-blue-500" : ""
                    )}
                    onClick={() => {
                        priceRef.current?.focus();
                        refreshEditingPrice();
                    }}
                >
                    <input ref={priceRef}
                           className={"w-full border border-gray-300 rounded-md p-2 outline-none border-none"}
                           value={priceValue}
                           onInput={(e) => {
                               // Only allow numbers and decimals
                               let value = e.currentTarget.value || "0";
                               if (value.match(/^[0-9]*\.?[0-9]*$/)) {
                                   while (value[0] === "0" && value.length > 1 && value[1] !== ".") {
                                       value = value.substring(1);
                                   }
                                   if (value.includes(".")) {
                                       const decimals = value.split(".")[1];
                                       if (decimals.length > 18) {
                                           value = value.substring(0, value.length - (decimals.length - 18));
                                       }
                                   }
                                   setPriceValue(value || "0");
                               }
                           }}
                           onBlur={() => {
                               refreshEditingPrice();
                               // Remove number after 18 decimals
                               const weiValue = ethers.utils.parseEther(priceValue);
                               // compare with weiBalance
                               if (weiValue.gt(weiBalance)) {
                                   setPriceValue(ethers.utils.formatEther(weiBalance));
                               }
                           }}
                    />
                    <span className={"pr-2 text-gray-400"}>{currencyTicker}</span>
                </span>

            </div>
            <div>
                <label className={"font-semibold"}>Duration</label>
                <span
                    className={"flex flex-row items-baseline gap-2 rounded-md border bg-white" + (
                        editingDuration ? " outline outline-2 outline-blue-500" : ""
                    )}
                    onClick={() => {
                        durationRef.current?.focus();
                        refreshEditingDuration();
                    }}
                >
                    <input ref={durationRef}
                           className={"w-full border border-gray-300 rounded-md p-2 outline-none border-none"}
                           value={duration}
                           onInput={(e) => {
                               // Only allow numbers and decimals
                               let value = e.currentTarget.value || "0";
                               if (value.match(/^[0-9]*$/)) {
                                   while (value[0] === "0" && value.length > 1) {
                                       value = value.substring(1);
                                   }
                                   setDuration(value || "0");
                               }
                           }}
                           onBlur={() => {
                               refreshEditingDuration();
                           }}
                    />
                    <span className={"pr-2 text-gray-400"}>minutes</span>
                </span>

            </div>
            <button
                className={
                    "enabled:bg-blue-500 disabled:bg-gray-400 px-2 py-1 rounded-md text-white transition" +
                    " enabled:hover:bg-blue-400 disabled:cursor-default"
                }
                disabled={!enablePosting}
                onClick={() => {
                    sendRequest();
                }}
            >
                Post Request
            </button>
        </div>
    ) : (
        <div className={"text-center"}>
            Please connect your wallet to make an image request
        </div>
    )
}

export default Requesting;