import React, {useEffect} from 'react';

import {BountyT} from '../types.tsx/types';
import BountyPrice from './BountyPrice';
import Countdown from './Countdown';
import Prompt from './Prompt';
import SubmissionPrev from './SubmissionPrev';
import Web3Context from "../contexts/Web3Context";
import {callGetSubmissions, callNumSubmissions} from "../helpers/web3";
import {BigNumber} from "ethers";
import {getChainData} from "../helpers/utilities";
import Web3 from "web3";


function Bounty({data}: { data: BountyT }) {
    const {web3, connected, chainId} = React.useContext(Web3Context);

    const [submissions, setSubmissions] = React.useState([]);

    function refreshSubmissionWithWeb3(web3: any, chainId: number) {
        const id = data.id;
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
                        const {submissionTime} = submission;
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
    }, [data, web3, connected, chainId])

    return (
        <div className='flex flex-row gap-2 h-64'>
            <BountyPrice price={data.bounty}/>
            <div className="flex flex-col w-64 py-4">
                <Prompt prompt={data.description}/>
                <Countdown data={data}/>
            </div>
            <SubmissionPrev submissions={submissions}/>
        </div>
    );
}

export default Bounty;
