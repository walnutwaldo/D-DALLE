import Bounties from "./Bounties";
import React from "react";
import PageContext, {PageType} from "../contexts/PageContext";
import Requesting from "./Requesting";

function Body() {
    const {page} = React.useContext(PageContext);

    return (
        <div className={"container mx-auto py-4"}>
            <div className={page === PageType.Propose ? "" : "hidden"}>
                <Bounties/>
            </div>
            <div className={page === PageType.Request ? "" : "hidden"}>
                <Requesting/>
            </div>
        </div>
    )
}

export default Body;