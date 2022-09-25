import React from "react";
import GlobalDataContext from "../contexts/GlobalDataContext";
import { useParams } from 'react-router-dom';
import { BigNumber, ethers } from "ethers";
import Prompt from "./Prompt";
import Countdown from "./Countdown";
import { SubmissionT } from "../types.tsx/types";
import SubmitSection from "./SubmitSection";
import SubmissionProvider from "../contexts/SubmissionProvider";
import SubmissionContext from "../contexts/SubmissionContext";
import SingleSubmission from "./SingleSubmission";


function BountyPrice({ price }: { price: BigNumber }) {
    return <div className="">
        <div className="flex flex-row items-end">
            <div className="text-5xl text-bold">{ethers.utils.formatEther(price)} </div>
            <div className="text-xl text-bold pl-2 pb-2">KLAY</div>
        </div>
    </div >
}


function BountyPage() {
    const { id } = useParams();

    const { globalData } = React.useContext(GlobalDataContext);
    const bounty = globalData.bounties.filter(b => b.id === id)[0];
    if (!id || !bounty) return <div>Not found: {id}</div>;

    const isOver = (new Date().getTime() / 1000) > bounty.deadline;
    const isOwner = true;

    return (
        <div>
            <div className="pt-12" />
            <Prompt prompt={bounty.description} />
            <div className="flex flex-row justify-center items-center pt-12">
                <BountyPrice price={bounty.bounty} />
                <div className="w-1 bg-gray-700 mx-5 h-8" ></div>
                <Countdown data={bounty} classes="text-4xl" />
            </div>

            {!isOver && <div>
                <SubmitSection data={bounty} />
            </div>}

            <div className="mt-12 bg-gray-200 ">
                <div className="bg-gray-700 py-7">
                    <div className="text-2xl text-white font-medium text-center ">
                        {isOver && isOwner ? "Time to choose a winner" : "Previous submissions"}
                    </div>
                    {(isOver || isOwner) && <div className="text-lg text-white text-center mt-2">
                        {isOver && !isOwner && "Waiting for the owner to choose a winner."}
                        {isOver && isOwner && "Select which image you want to award the bounty to."}
                        {!isOver && isOwner && "You can choose a winner when the time is up."}
                    </div>}
                </div>
                <div className="mt-8 flex flex-row flex-wrap justify-around">
                    <SubmissionProvider id={id}>
                        <SubmissionContext.Consumer>
                            {({ submissions }) => submissions.map(
                                sub => <SingleSubmission key={sub.submissionId} submission={sub} />
                            )}
                        </SubmissionContext.Consumer>
                    </SubmissionProvider>
                </div>
            </div>
        </div>
    );
};

export default BountyPage;