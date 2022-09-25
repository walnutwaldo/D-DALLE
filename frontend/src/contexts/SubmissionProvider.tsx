import React, { useCallback, useEffect, useState } from "react";
import { SubmissionT } from "../types.tsx/types";
import Web3Context from "../contexts/Web3Context";
import { callGetSubmissions, callNumSubmissions } from "../helpers/web3";
import { BigNumber } from "ethers";
import { getChainData } from "../helpers/utilities";
import Web3 from "web3";
import SubmissionContext from "./SubmissionContext";

function SubmissionProvider({ children, submissionsContract }: { children: any, submissionsContract: string }) {
    const { web3, connected, chainId } = React.useContext(Web3Context);
    const [submissions, setSubmissions] = useState<SubmissionT[]>([]);

    const refresh = useCallback(() => {
        console.log("Fetching submissions for ", submissionsContract);
        function refreshSubmissionWithWeb3(web3: any) {
            callNumSubmissions(submissionsContract, web3)
                .then((numSubmissions: any) => {
                    if (BigNumber.from(numSubmissions).gt(0)) {
                        return callGetSubmissions(submissionsContract, 0, web3)
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
        if (chainId) {
            if (web3 && connected) {
                refreshSubmissionWithWeb3(web3);
            } else {
                refreshSubmissionWithWeb3(new Web3(getChainData(chainId).rpc_url));
            }
        }
    }, [chainId, web3, connected, submissionsContract]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    // timer to refresh every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            refresh();
        }, 5000);
        return () => clearInterval(timer);
    }, [refresh]);
    // ...

    return (
        <SubmissionContext.Provider value={{ submissions, setSubmissions }}>
            {children}
        </SubmissionContext.Provider>
    );
}

export default SubmissionProvider;