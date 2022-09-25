import React, {useEffect} from 'react';

import {BountyT} from '../types.tsx/types';
import BountyPrice from './BountyPrice';
import Countdown from './Countdown';
import Prompt from './Prompt';
import SubmissionPrev from './SubmissionPrev';
import Web3Context from "../contexts/Web3Context";
import {callGetSubmissions, callNumSubmissions} from "../helpers/web3";
import {BigNumber} from "ethers";


function Bounty({data}: { data: BountyT }) {
    const {web3, connected} = React.useContext(Web3Context);

    const [submissions, setSubmissions] = React.useState([]);

    useEffect(() => {
        const id = data.id;
        if (web3 && connected) {
            callNumSubmissions(id, web3)
                .then((numSubmissions: any) => {
                    if (BigNumber.from(numSubmissions).gt(0)) {
                        return callGetSubmissions(id, 0, web3)
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
    }, [data, web3, connected])

    return (
        <div className='flex flex-row h-64'>
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
