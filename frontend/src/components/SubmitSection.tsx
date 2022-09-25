import React, { useContext } from "react";
import { ethers } from "ethers";
import LinearProgress from '@mui/material/LinearProgress';
import { BACKEND_DOMAIN } from "../constants/constants";
import { callSubmit } from "../helpers/web3";
import { BountyT } from "../types.tsx/types";
import Web3Context from "../contexts/Web3Context";
import { getChainData } from "../helpers/utilities";


function SubmitSection({ data }: { data: BountyT }) {
    const [prompt, setPrompt] = React.useState(data.description);
    const [loading, setLoading] = React.useState(false);
    const [results, setResults] = React.useState([] as string[]);
    const [selImg, setSelImg] = React.useState(-1);
    const [proposing, setProposing] = React.useState(false);
    const { connected, web3, address, networkId, chainId, connectWallet } = useContext(Web3Context);

    const showResults = loading || results.length > 0;
    const readyToSubmit = selImg !== -1;

    const sendRequest = async () => {
        setLoading(true);
        console.log("BACKEND_DOMAIN", BACKEND_DOMAIN);
        const res = await fetch(BACKEND_DOMAIN + "/prompt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: prompt }),
        });
        const json = await res.json();
        console.log("Response: ", json);
        if (!json.success) {
            alert("Error: " + json);
        }
        setResults(json.urls);
        setLoading(false);
    };

    const propose = async () => {
        setProposing(true);
        const uri = results[selImg];
        console.log("Propose: ", uri);
        console.log("Connected:", connected, "to network:", networkId);

        if (connected) {
            callSubmit(
                address,
                chainId,
                data.submissionsContract,
                uri,
                prompt,
                web3
            ).then(async (res) => {
                const txn = await (new ethers.providers.JsonRpcProvider(getChainData(chainId).rpc_url)).getTransaction(
                    res as string
                );
                const receipt = await txn.wait();
                console.log("Receipt: ", receipt);
            }).catch().then(() => {
                setProposing(false);
            });
        } else {
            fetch(BACKEND_DOMAIN + "/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: prompt,
                    uri: uri,
                    taskId: data.id,
                    chainId: Number(chainId)
                })
            }).then(res => res.json()).then(async (res) => {
                console.log("Result: ", res);
                if (res.success) {
                    const txnHash = res.txn.hash;
                    const txn = await (new ethers.providers.JsonRpcProvider(getChainData(chainId).rpc_url)).getTransaction(
                        txnHash
                    );
                    const receipt = await txn.wait();
                    console.log("Receipt: ", receipt);
                } else {
                    alert("Error: " + res.error);
                }
            }).catch().then(() => {
                setProposing(false);
            });
        }
    };

    const style_half = "w-1/2 mx-auto flex flex-col gap-2";

    return (
        <div className="submit-section mt-6 bg-gray-200 pb-5 rounded-lg overflow-hidden ">
            <div className="bg-gray-700 text-2xl text-white font-medium text-center py-7">
                Submit Your Prompt
            </div>
            <div className={style_half}>
                <div className="pt-5">
                    <label className={"font-semibold"}>Prompt</label>
                    <input
                        className={"w-full h- border border-gray-300 rounded-md p-2"}
                        value={prompt}
                        disabled={loading}
                        onInput={(e) => setPrompt(e.currentTarget.value)}
                    />
                </div>
                <button
                    className={
                        "enabled:bg-blue-500 disabled:bg-gray-400 px-2 py-1 rounded-md text-white transition" +
                        " enabled:hover:bg-blue-400 disabled:cursor-default"
                    }
                    disabled={loading || prompt.length < 3}
                    onClick={() => sendRequest()}
                >
                    Generate Images (takes ~20sec)
                </button>
                {loading && <div className="pt-2 pb-4">
                    <LinearProgress />
                </div>}
            </div>
            <div className={"flex flex-col px-12 lg:px-36 xl:px-12"}>

                {showResults && results.length > 0 && <div className="flex flex-row flex-wrap justify-around">
                    {results.map((url, i) => (
                        <div key={i}
                            className={"flex flex-col w-64 bg-gray-500 my-5 rounded-lg overflow-hidden " + (selImg === i ? "outline outline-8 outline-blue-500" : "")}
                            onClick={() => setSelImg(i)}>
                            <img src={url} alt="submission" />
                        </div>
                    ))}
                </div>
                }
            </div>
            {showResults && results.length > 0 && <div className={style_half}>
                {!connected && <div className={"text-center text-orange-600 py-1 rounded-md bg-orange-200"}>
                    <button className={"underline"} onClick={
                        connectWallet
                    }>Connect your wallet</button> to earn rewards if your artwork is selected
                </div>}
                <button
                    className={
                        "enabled:bg-blue-500 disabled:bg-gray-400 px-2 py-1 rounded-md text-white transition" +
                        " enabled:hover:bg-blue-400 disabled:cursor-default "
                    }
                    disabled={!readyToSubmit || proposing}
                    onClick={() => propose()}
                >
                    {proposing ? "Proposing ..." : "Propose Image" + (!connected ? " Anyway" : "")}
                </button>
            </div>
            }
        </div>
    );
}

export default SubmitSection;