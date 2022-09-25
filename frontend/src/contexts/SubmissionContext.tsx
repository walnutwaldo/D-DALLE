import React from "react";
import { SubmissionT } from "../types.tsx/types";


export type SubmissionContextType = {
    submissions: SubmissionT[],
    setSubmissions: (submissions: SubmissionT[]) => void,
}

const SubmissionContext = React.createContext<SubmissionContextType>({
    submissions: [],
    setSubmissions: (submissions: SubmissionT[]) => { },
});

export default SubmissionContext;