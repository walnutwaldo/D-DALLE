import React, {useContext, useEffect, useState} from "react";
import Web3Context from "../contexts/Web3Context";

function Requesting() {
    const {connected} = useContext(Web3Context);

    const [priceValue, setPriceValue] = useState("0");
    const [editingPrice, setEditingPrice] = useState(false);

    const ref = React.createRef<HTMLInputElement>();

    function refreshEditingPrice() {
        setEditingPrice(document.activeElement === ref?.current);
    }

    useEffect(() => {
        document.addEventListener("mouseup", refreshEditingPrice);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mouseup", refreshEditingPrice);
        };
    }, [])

    return connected ? (
        <div className={"w-1/2 mx-auto"}>
            <h3 className={"text-lg font-bold"}>Request an Image</h3>
            <label>Description</label>
            <textarea className={"w-full h-32 border border-gray-300 rounded-md p-2"}/>
            <label>Bounty</label>
            <span
                className={"flex flex-row items-baseline gap-2 rounded-md" + (
                    editingPrice ? " border-2 border-blue-400" : " border"
                )}
                onClick={() => {
                    ref.current?.focus();
                }}
            >
                <input ref={ref} className={"w-full border border-gray-300 rounded-md p-2 outline-none border-none"}
                       value={priceValue}
                       onInput={(e) => {
                           // Only allow numbers and decimals
                           let value = e.currentTarget.value || "0";
                           if (value.match(/^[0-9]*\.?[0-9]*$/)) {
                               while (value[0] === "0" && value.length > 1 && value[1] !== ".") {
                                   value = value.substring(1);
                               }
                               setPriceValue(value || "0");
                           }
                       }}/>
                <span className={"pr-2"}>KLAY</span>
            </span>
        </div>
    ) : (
        <div className={"text-center"}>
            Please connect your wallet to make an image request
        </div>
    )
}

export default Requesting;