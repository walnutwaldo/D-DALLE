import React from "react";
import LinearProgress from '@mui/material/LinearProgress';
import { BACKEND_DOMAIN } from "../constants/constants";


function SubmitSection({ promptReq }: { promptReq: string }) {
    const [prompt, setPrompt] = React.useState(promptReq);
    const [loading, setLoading] = React.useState(false);
    const [results, setResults] = React.useState([] as string[]);
    const [selImg, setSelImg] = React.useState(-1);

    const showResults = loading || results.length > 0;
    const readyToSubmit = selImg !== -1;

    const sendRequest = async () => {
        setLoading(true);
        const data = { prompt: prompt };
        const res = await fetch(BACKEND_DOMAIN + "/prompt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const json = await res.json();
        console.log("Response: ", json);
        if (!json.success) {
            alert("Error: " + json);
        }
        setResults(json.urls);
    };

    const propose = () => {
        console.log("Propose: ", selImg);
    };

    return (
        <div className="submit-section mt-6 bg-gray-200 pb-5">
            <div className="bg-gray-700 text-2xl text-white font-medium text-center py-7">
                Submit Your Prompt
            </div>
            <div className={"w-1/2 mx-auto flex flex-col gap-2"}>
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
                <div className={"flex flex-col " + (showResults ? "" : "hidden")}>
                    {results.length === 0 && <div className="pt-2 pb-4">
                        <LinearProgress />
                    </div>}
                    {results.length > 0 && <div>
                        Results...
                    </div>
                    }
                    <button
                        className={
                            "enabled:bg-blue-500 disabled:bg-gray-400 px-2 py-1 rounded-md text-white transition" +
                            " enabled:hover:bg-blue-400 disabled:cursor-default "
                        }
                        disabled={!readyToSubmit}
                        onClick={() => propose()}
                    >Propose Image</button>
                </div>
            </div>


        </div>
    );
}

export default SubmitSection;