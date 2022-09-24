import React from "react";
import PageContext from "../contexts/PageContext";
import { useParams } from 'react-router-dom';

function BountyPage() {
    const { id } = useParams();

    const { globalData } = React.useContext(PageContext);
    return (
        <div>
            Details {id}
        </div>
    )
};

export default BountyPage;