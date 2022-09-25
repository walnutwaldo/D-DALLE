import { SubmissionT } from "../types.tsx/types";


function SingleSubmission({ submission }: { submission: SubmissionT }) {
    return (
        <div className="flex flex-col w-64 bg-gray-500 rounded-lg overflow-hidden">
            <img src={submission.uri} alt="submission" className={""} />
        </div>
    );
}

function SubmissionPrev({ submissions }: { submissions: SubmissionT[] }) {
    // Only display first four submissions
    const submissionsToDisplay = submissions.slice(0, 4);

    return (
        <div className="flex shrink overflow-hidden">
            <div className="flex flex-row gap-2">
                {
                    submissionsToDisplay.map((submission, idx) => (
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