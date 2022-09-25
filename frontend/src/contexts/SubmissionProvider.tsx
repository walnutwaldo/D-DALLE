import React, { useEffect, useState } from "react";
import { SubmissionT } from "../types.tsx/types";
import Web3Context from "../contexts/Web3Context";
import { callGetSubmissions, callNumSubmissions } from "../helpers/web3";
import { BigNumber } from "ethers";
import { getChainData } from "../helpers/utilities";
import Web3 from "web3";
import SubmissionContext from "./SubmissionContext";

function SubmissionProvider({ id, children }: { id: string, children: any }) {
    const { web3, connected, chainId } = React.useContext(Web3Context);
    const [submissions, setSubmissions] = useState<SubmissionT[]>([]);

    function refreshSubmissionWithWeb3(web3: any, chainId: number) {
        callNumSubmissions(id, web3, chainId)
            .then((numSubmissions: any) => {
                if (BigNumber.from(numSubmissions).gt(0)) {
                    return callGetSubmissions(id, 0, web3, chainId)
                } else {
                    return [];
                }
            })
            .then(
                (submissions: any) => setSubmissions(
                    submissions.map((submission: any) => {
                        const { submissionTime } = submission;
                        return {
                            ...submission,
                            submissionTime: Number(submissionTime)
                        }
                    })
                )
            );
    }

    useEffect(() => {
        if (chainId) {
            if (web3 && connected) {
                refreshSubmissionWithWeb3(web3, chainId);
            } else {
                refreshSubmissionWithWeb3(new Web3(getChainData(chainId).rpc_url), chainId);
            }
        }
    }, [id, web3, connected, chainId])
    // ...

    return (
        <SubmissionContext.Provider value={{ submissions, setSubmissions }}>
            {children}
        </SubmissionContext.Provider>
    );
}

export default SubmissionProvider;