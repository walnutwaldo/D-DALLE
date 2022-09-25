import React from "react";
import { SubmissionT } from "../types.tsx/types";


export type SubmissionContextType = {
    submissions: SubmissionT[],
    setSubmissions: (submissions: SubmissionT[]) => void,
    refresh: () => void,
}

const SubmissionContext = React.createContext<SubmissionContextType>({
    submissions: [],
    setSubmissions: (submissions: SubmissionT[]) => { },
    refresh: () => { },
});

export default SubmissionContext;