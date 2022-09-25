import React, { useContext } from "react";
import { BigNumber } from "ethers";
import LinearProgress from '@mui/material/LinearProgress';
import { BACKEND_DOMAIN } from "../constants/constants";
import { callSubmit } from "../helpers/web3";
import { BountyT } from "../types.tsx/types";
import Web3Context from "../contexts/Web3Context";


function SubmitSection({ data }: { data: BountyT }) {
    const [prompt, setPrompt] = React.useState(data.description);
    const [loading, setLoading] = React.useState(false);
    const [results, setResults] = React.useState([] as string[]);
    const [selImg, setSelImg] = React.useState(-1);
    const { connected, web3, address, networkId, chainId } = useContext(Web3Context);

    const showResults = loading || results.length > 0;
    const readyToSubmit = selImg !== -1;

    const sendRequest = async () => {
        setLoading(true);
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

    const propose = () => {
        const uri = results[selImg];
        console.log("Propose: ", uri);
        console.log("Connected:", connected, "to network:", networkId);

        callSubmit(
            address,
            chainId,
            BigNumber.from(data.id),
            uri,
            prompt,
            web3
        ).then((res) => {
            console.log("Result: ", res);
        });
    };

    const style_half = "w-1/2 mx-auto flex flex-col gap-2";

    return (
        <div className="submit-section mt-6 bg-gray-200 pb-5">
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
                            className={"flex flex-col w-64 bg-gray-500 my-5 " + (selImg === i ? "border-8 border-blue-500" : "")}
                            onClick={() => setSelImg(i)}>
                            <img src={url} alt="submission" />
                        </div>
                    ))}
                </div>
                }
            </div>
            {showResults && results.length > 0 && <div className={style_half}>
                <button
                    className={
                        "enabled:bg-blue-500 disabled:bg-gray-400 px-2 py-1 rounded-md text-white transition" +
                        " enabled:hover:bg-blue-400 disabled:cursor-default "
                    }
                    disabled={!readyToSubmit}
                    onClick={() => propose()}
                >Propose Image</button>
            </div>
            }
        </div >
    );
}

export default SubmitSection;