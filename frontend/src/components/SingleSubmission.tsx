import { SubmissionT } from "../types.tsx/types";

function SingleSubmission(props: { submission: SubmissionT, onSelect?: () => void, selected?: boolean }) {
    const { submission, onSelect, selected } = props;
    const onSelectFun = (e: React.MouseEvent) => {
        if (e.stopPropagation) e.stopPropagation();
        onSelect && onSelect();
    }
    const wpStyle = "flex flex-col w-64 bg-gray-500 relative " + (selected ? "outline outline-8 outline-blue-500" : "");
    const buttonStyle = "absolute w-full bottom-0 text-white text-center bg-gray-600 hover:bg-gray-500 transition py-2 " + (selected ? " !bg-blue-500" : "");
    return (
        <button className={wpStyle} onClick={() => {
            window.open(submission.uri, "_blank");
        }}>
            <div className="absolute w-full h-full bg-black/[0.5] grid items-center	transition opacity-0 hover:opacity-100">
                <div className="text-white text-center px-5">{submission.prompt}</div>
                {onSelect && <div className={buttonStyle} onClick={onSelectFun}>
                    {selected ? "Selected" : "Select"}
                </div>}
            </div>
            <img src={submission.uri} alt="submission" />
        </button >
    );
}
export default SingleSubmission;