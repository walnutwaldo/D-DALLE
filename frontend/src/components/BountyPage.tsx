import React from "react";
import GlobalDataContext from "../contexts/GlobalDataContext";
import { useParams } from 'react-router-dom';

function BountyPage() {
    const { id } = useParams();

    const { globalData } = React.useContext(GlobalDataContext);
    return (
        <div>
            Details {id}
        </div>
    )
};

export default BountyPage;