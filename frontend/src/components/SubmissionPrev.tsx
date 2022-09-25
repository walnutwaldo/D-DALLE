import { SubmissionT } from "../types.tsx/types";


function SingleSubmission({ submission }: { submission: SubmissionT }) {
    return (
        <div className="flex flex-col w-64 bg-gray-500">
            <img src={submission.uri} alt="submission" />
        </div>
    );
}

function SubmissionPrev({ submissions }: { submissions: SubmissionT[] }) {
    return (
        <div className="flex shrink overflow-hidden">
            <div className="flex flex-row">
                {
                    submissions.map((submission, idx) => (
                        <div key={idx}>
                            <SingleSubmission submission={submission} />
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default SubmissionPrev;