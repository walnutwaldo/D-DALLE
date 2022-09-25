import {BigNumber} from "ethers";

type SubmissionT = {
    submissionId: string;
    uri: string;
    prompt: string; // No guarantee this was the actual prompt
    submitter: string;
    submissionTime: number;
};

type BountyT = {
    id: string;
    owner: string;
    bounty: BigNumber;
    deadline: number;
    description: string;
    completed: boolean;
    winner: string;
};

export type { SubmissionT, BountyT };