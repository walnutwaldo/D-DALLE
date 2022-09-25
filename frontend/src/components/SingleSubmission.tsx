import { SubmissionT } from "../types.tsx/types";

function SingleSubmission({ submission }: { submission: SubmissionT }) {
    return (
        <div className="flex flex-col w-64 bg-gray-500 relative">
            <div className="absolute w-full h-full bg-black/[0.5] grid items-center	transition opacity-0 hover:opacity-100">
                <div className="text-white text-center px-5">{submission.prompt}</div>
            </div>
            <img src={submission.uri} alt="submission" />
        </div>
    );
}
export default SingleSubmission;