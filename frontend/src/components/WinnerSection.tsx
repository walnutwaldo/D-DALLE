import { useContext } from "react";
import { BigNumber, ethers } from "ethers";
import Web3Context from "../contexts/Web3Context";
import { callAssignWinner } from "../helpers/web3";
import { BountyT, SubmissionT } from "../types.tsx/types";


function WinnerSection(props: { submission: SubmissionT | null, bounty: BountyT, claimable?: boolean, chooseWinner: () => void }) {
    const { submission, bounty, claimable, chooseWinner } = props;
    const { web3, address, chainId } = useContext(Web3Context);
    if (!submission) return <></>;

    const claim = () => {
        console.log("Claiming as winner:", submission.submissionId);
        callAssignWinner(
            address,
            chainId,
            BigNumber.from(bounty.id),
            BigNumber.from(submission.submissionId),
            web3
        ).then((res) => {
            console.log("Result: ", res);
            chooseWinner();
        }).catch().then(() => {

        });
    };

    const titleStyle = "text-md font-bold mt-3";
    const valueStyle = "text-lg";
    return <div className="flex flex-row h-[32rem] justify-center mt-20 mb-8">
        <img src={submission.uri} alt="winning submission" />
        <div className="flex flex-col max-w-[32rem] pl-5">
            <div className="text-3xl font-bold mt-2">
                Selected Winner
            </div>
            <div className="flex flex-col justify-center flex-grow">
                <div className={titleStyle}>
                    Prompt:
                </div>
                <div className={valueStyle}>
                    {submission.prompt}
                </div>

                <div className={titleStyle}>
                    Creator:
                </div>
                <div className={valueStyle + " font-mono"}>
                    {submission.submitter}
                </div>

                <div className={titleStyle}>
                    Bounty
                </div>
                <div className={valueStyle}>
                    <span className="font-bold">
                        {ethers.utils.formatEther(bounty.bounty)}
                    </span> KLAY
                </div>
            </div>
            {claimable && <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-5 font-lg"
                onClick={claim}>
                Select Winner
            </button>
            }
        </div>
    </div>
}

export default WinnerSection;