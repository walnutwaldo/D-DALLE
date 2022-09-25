import {BigNumber} from "ethers";

type SubmissionT = {
    submissionId: string;
    uri: string;
    prompt: string; // No guarantee this was the actual prompt
    owner: string;
};

type BountyT = {
    id: string;
    owner: string;
    bounty: BigNumber;
    deadline: number;
    description: string;
    completed: boolean;
    winner: string;
    submissionsContract: string;
};

export type { SubmissionT, BountyT };