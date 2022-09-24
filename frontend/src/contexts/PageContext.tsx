import React from "react";

export enum PageType {
    Propose,
    Request
}

export type PageContextType = {
    page: PageType,
    setPage: (page: PageType) => void
}

const PageContext = React.createContext<PageContextType>({
    page: PageType.Propose,
    setPage: (page: PageType) => {
    }
});

export default PageContext;