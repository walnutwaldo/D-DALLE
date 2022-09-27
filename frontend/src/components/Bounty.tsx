import React from 'react';
import SubmissionContext from '../contexts/SubmissionContext';
import SubmissionProvider from '../contexts/SubmissionProvider';

import { BountyT } from '../types.tsx/types';
import BountyPrice from './BountyPrice';
import Countdown from './Countdown';
import Prompt from './Prompt';
import SubmissionPrev from './SubmissionPrev';
import { Link, useNavigate } from "react-router-dom";


function Bounty({ data }: { data: BountyT }) {
    const navigate = useNavigate();
    console.log(data);

    return (
        <div className='flex flex-col md:flex-row gap-4 md:h-64 mb-12 md:mb-0'>
            <div onClick={() => navigate("/propose/" + data.submissionsContract)} className={
                'flex flex-col md:flex-row gap-4 md:h-64 bg-gray-200 md:rounded-lg cursor-pointer hover:bg-gray-300 items-center'
            }>
                <BountyPrice price={data.bounty} />
                <div className="flex flex-col w-64 py-4 shrink-0">
                    <Prompt prompt={data.description} />
                    <Countdown data={data} classes="text-2xl pt-3" />
                    <Link
                        to={"/propose/" + data.submissionsContract}
                        className="text-gray-500 underline text-center text-sm pt-3">
                        Details..
                    </Link>
                </div>
            </div>
            <SubmissionProvider submissionsContract={data.submissionsContract}>
                <SubmissionContext.Consumer>
                    {({ submissions }) => <SubmissionPrev submissions={submissions} />}
                </SubmissionContext.Consumer>
            </SubmissionProvider>
        </div>
    );
}

export default Bounty;
