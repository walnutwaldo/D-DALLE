import React, { useContext } from "react";
import GlobalDataContext from "../contexts/GlobalDataContext";
import { useParams } from 'react-router-dom';
import { BigNumber, ethers } from "ethers";
import Prompt from "./Prompt";
import Countdown from "./Countdown";
import { BountyT, SubmissionT } from "../types.tsx/types";
import SubmitSection from "./SubmitSection";
import SubmissionProvider from "../contexts/SubmissionProvider";
import SubmissionContext from "../contexts/SubmissionContext";
import SingleSubmission from "./SingleSubmission";
import WinnerSection from "./WinnerSection";
import Web3Context from "../contexts/Web3Context";


function BountyPrice({ price }: { price: BigNumber }) {
    return <div className="">
        <div className="flex flex-row items-end">
            <div className="text-5xl text-bold">{ethers.utils.formatEther(price)} </div>
            <div className="text-xl text-bold pl-2 pb-2">KLAY</div>
        </div>
    </div >
}

function BountyPageMain(props: { bounty: BountyT, submissions: SubmissionT[] }) {
    const { bounty, submissions } = props;
    const { address } = React.useContext(Web3Context);
    const [selSub, setSelSub] = React.useState<SubmissionT | null>(null);
    const [winnerChosen, setWinnerChosen] = React.useState(false);

    React.useEffect(() => {
        const winnerSubList = (bounty.completed
            ? submissions.filter((sub) => sub.submissionId === bounty.winner)
            : []);
        const winnerSub = winnerSubList.length > 0 ? winnerSubList[0] : null;
        if (winnerSub) setSelSub(winnerSub);
    }, [bounty, submissions]);

    const isOver = (new Date().getTime() / 1000) > bounty.deadline;
    const isOwner = address === bounty.owner;
    const isClaimable = isOver && isOwner && !bounty.completed && !winnerChosen;

    return <div>
        <div className="pt-12" />
        <Prompt prompt={bounty.description} />
        <WinnerSection submission={selSub} bounty={bounty}
            claimable={isClaimable} chooseWinner={() => setWinnerChosen(true)} />
        <div className="flex flex-row justify-center items-center items-baseline pt-12">
            <BountyPrice price={bounty.bounty} />
            <div className="w-1 bg-gray-700 mx-5 h-8" ></div>
            <Countdown data={bounty} classes="text-4xl" />
        </div>

        {
            !isOver && <div>
                <SubmitSection data={bounty} />
            </div>
        }

        <div className="mt-12 bg-gray-200 rounded-lg overflow-hidden ">
            <div className="bg-gray-700 py-7">
                <div className="text-2xl text-white font-medium text-center ">
                    {isClaimable ? "Time to choose a winner" : (
                        bounty.completed ? "Other submissions" : "Previous submissions")}
                </div>
                {(isOver || isOwner) && !bounty.completed && <div className="text-lg text-white text-center mt-2">
                    {isOver && !isOwner && "Waiting for the owner to choose a winner."}
                    {isOver && isOwner && "Select which image you want to award the bounty to."}
                    {!isOver && isOwner && "You can choose a winner when the time is up."}
                </div>}
            </div>
            <div className="py-8 flex flex-row flex-wrap justify-around gap-8">
                {submissions.map(
                    sub => <SingleSubmission
                        key={sub.submissionId}
                        submission={sub}
                        onSelect={(isClaimable && (() => setSelSub(sub))) || undefined}
                        selected={sub.submissionId === selSub?.submissionId} />
                )}
            </div>
        </div>
    </div >
}

function BountyPage() {
    const { globalData } = useContext(GlobalDataContext);

    const { contractAddress } = useParams();
    const bounty = globalData.bounties.filter(b => b.submissionsContract === contractAddress)[0];
    if (!contractAddress || !bounty) return <div>Not found: {contractAddress}</div>;

    return (
        <SubmissionProvider submissionsContract={contractAddress}>
            <SubmissionContext.Consumer>
                {({ submissions }) => <BountyPageMain bounty={bounty} submissions={submissions} />}
            </SubmissionContext.Consumer>
        </SubmissionProvider>
    );
};

export default BountyPage;