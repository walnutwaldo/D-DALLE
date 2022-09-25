import { SubmissionT } from "../types.tsx/types";
import SingleSubmission from "./SingleSubmission";


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