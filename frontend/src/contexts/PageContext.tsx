import React from "react";
import { BountyT } from "../types.tsx/types";


export type GlobalData = {
    bounties: BountyT[],
}

export type PageContextType = {
    globalData: GlobalData
    setGlobalData: (globalData: GlobalData) => void,
}

const PageContext = React.createContext<PageContextType>({
    globalData: { bounties: [] },
    setGlobalData: (globalData: GlobalData) => { },
});

export default PageContext;