
type SubmissionT = {
    user: string;
    image: string;
};

type BountyT = {
    id: string;
    user: string;
    bounty: number;
    deadline: number;
    prompt: string;
    submissions: SubmissionT[];
};

export type { SubmissionT, BountyT };