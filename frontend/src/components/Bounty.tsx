import React, {useEffect} from 'react';
import SubmissionContext from '../contexts/SubmissionContext';
import SubmissionProvider from '../contexts/SubmissionProvider';

import {BountyT} from '../types.tsx/types';
import BountyPrice from './BountyPrice';
import Countdown from './Countdown';
import Prompt from './Prompt';
import SubmissionPrev from './SubmissionPrev';
import {useNavigate} from "react-router-dom";


function Bounty({data}: { data: BountyT }) {
    const navigate = useNavigate();

    const sel_bounty = (id: string) => {
        navigate("/propose/" + id);
    };

    return (
        <div className='flex flex-row gap-4 h-64'>
            <div onClick={() => sel_bounty(data.id)} className={
                'flex flex-row gap-4 h-64 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300'
            }>
                <BountyPrice price={data.bounty}/>
                <div className="flex flex-col w-64 py-4 shrink-0">
                    <Prompt prompt={data.description}/>
                    <Countdown data={data} classes="text-2xl pt-3"/>
                </div>
            </div>
            <SubmissionProvider id={data.id}>
                <SubmissionContext.Consumer>
                    {({submissions}) => <SubmissionPrev submissions={submissions}/>}
                </SubmissionContext.Consumer>
            </SubmissionProvider>
        </div>
    );
}

export default Bounty;
