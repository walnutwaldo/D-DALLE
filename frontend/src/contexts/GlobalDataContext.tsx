import React from "react";
import { BountyT } from "../types.tsx/types";


export type GlobalData = {
    bounties: BountyT[],
}

export type GlobalContextType = {
    globalData: GlobalData
    setGlobalData: (globalData: GlobalData) => void,
}

const GlobalDataContext = React.createContext<GlobalContextType>({
    globalData: { bounties: [] },
    setGlobalData: (globalData: GlobalData) => {},
});

export default GlobalDataContext;