import React from "react";
import PageContext from "../contexts/PageContext";
import { useParams } from 'react-router-dom';
import Prompt from "./Prompt";
import Countdown from "./Countdown";
import { SubmissionT } from "../types.tsx/types";
import SubmitSection from "./SubmitSection";


function BountyPrice({ price }: { price: number }) {
    return <div className="">
        <div className="flex flex-row items-end">
            <div className="text-5xl text-bold">{price} </div>
            <div className="text-xl text-bold pl-2 pb-2">KLAY</div>
        </div>
    </div >
}


function SingleSubmission({ submission }: { submission: SubmissionT }) {
    return (
        <div className="flex flex-col w-64 bg-gray-500">
            <img src={submission.image} alt="submission" />
        </div>
    );
}

function BountyPage() {
    const { id } = useParams();

    const { globalData } = React.useContext(PageContext);
    const bounty = globalData.bounties.filter(b => b.id === id)[0];
    return (
        <div>
            <div className="pt-12" />
            <Prompt prompt={bounty.prompt} />
            <div className="flex flex-row justify-center items-center pt-12">
                <BountyPrice price={bounty.bounty} />
                <div className="w-1 bg-gray-700 mx-5 h-8" ></div>
                <Countdown deadline={bounty.deadline} classes="text-4xl" />
            </div>

            <div>
                <SubmitSection promptReq={bounty.prompt} />
            </div>

            <div className="mt-12 bg-gray-200 flex flex-row flex-wrap justify-around">
                {bounty.submissions.map(sub => <SingleSubmission key={sub.image} submission={sub} />)}
            </div>
        </div>
    )
};

export default BountyPage;