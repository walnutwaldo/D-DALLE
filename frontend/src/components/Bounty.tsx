import React from 'react';

import { BountyT } from '../types.tsx/types';
import BountyPrice from './BountyPrice';
import Countdown from './Countdown';
import Prompt from './Prompt';
import SubmissionPrev from './SubmissionPrev';


function Bounty({ data }: { data: BountyT }) {
    return (
        <div className='flex flex-row h-64'>
            <BountyPrice price={data.bounty} />
            <div className="flex flex-col w-64 py-4">
                <Prompt prompt={data.prompt} />
                <Countdown deadline={data.deadline} />
            </div>
            <SubmissionPrev submissions={data.submissions} />
        </div>
    );
}

export default Bounty;
