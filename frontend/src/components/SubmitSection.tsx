import React, { useContext } from "react";
import { ethers } from "ethers";
import LinearProgress from '@mui/material/LinearProgress';
import { BACKEND_DOMAIN } from "../constants/constants";
import { callSubmit } from "../helpers/web3";
import { BountyT } from "../types.tsx/types";
import Web3Context from "../contexts/Web3Context";
import { getChainData } from "../helpers/utilities";
import SubmissionContext from "../contexts/SubmissionContext";


function SubmitSection({ data }: { data: BountyT }) {
    const [prompt, setPrompt] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [results, setResults] = React.useState([] as string[]);
    const [selImg, setSelImg] = React.useState(-1);
    const [proposing, setProposing] = React.useState(false);
    const { connected, web3, address, networkId, chainId, connectWallet, provider } = useContext(Web3Context);
    const { refresh: refreshSubmissions } = useContext(SubmissionContext);

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
                console.log("Txn hash:", res);
                const txn = await (new ethers.providers.Web3Provider(provider)).getTransaction(res as string);
                console.log("Txn:", txn);
                const receipt = await txn.wait();
                console.log("Receipt: ", receipt);
            }).catch((e) => {
            }).then(() => {
                setProposing(false);
            });
        } else {
            fetch(BACKEND_DOMAIN + "/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    submissionsContract: data.submissionsContract,
                    prompt: prompt,
                    uri: uri,
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
            }).catch((e) => {
            }).then(() => {
                setProposing(false);
            });
        }
    };

    React.useEffect(() => {
        if (readyToSubmit && !proposing) {
            // fetch submission again to get new image
            refreshSubmissions();
        }
    }, [proposing, refreshSubmissions]);

    const style_half = "w-3/4 lg:w-1/2 mx-auto flex flex-col gap-2";

    return (
        <div className="submit-section mt-6 bg-gray-200 pb-5 rounded-lg overflow-hidden ">
            <div className="bg-gray-700 text-2xl text-white font-medium text-center py-7">
                Try a Prompt
            </div>
            <div className={style_half}>
                <div className="pt-5">
                    <label className={"font-semibold"}>Prompt</label>
                    <input
                        className={"w-full h- border border-gray-300 rounded-md p-2"}
                        value={prompt}
                        placeholder={data.description}
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
                    Generate Images (takes ~40sec)
                </button>
                <span className={"text-center text-slate-400"}>Generate Free Images With DALL-E 2</span>
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
                    }>Connect your wallet
                    </button> to earn rewards when your art is selected
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
                    {/*{"Propose Image" + (!connected ? " Anyway" : "")}*/}
                </button>
                <span className={"text-slate-400 text-center"}>
                    {!connected && "Proposing is free if you don't have a wallet connected"}
                </span>
            </div>
            }
        </div>
    );
}

export default SubmitSection;