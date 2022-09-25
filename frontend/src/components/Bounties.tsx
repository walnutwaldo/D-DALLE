import React from 'react';
import PageContext from '../contexts/PageContext';
import Bounty from './Bounty';
import { useNavigate } from "react-router-dom";

function Bounties() {
    const { globalData } = React.useContext(PageContext);

    const navigate = useNavigate();
    const sel_bounty = (id: string) => {
        navigate("/propose/" + id);
    };
    return (
        <div>
            {
                globalData.bounties.map(bounty => (
                    <div key={bounty.id} onClick={() => sel_bounty(bounty.id)} className={
                        "p-2 bg-gray-200 m-4 rounded-lg cursor-pointer hover:bg-gray-300"
                    }>
                        <Bounty data={bounty}/>
                    </div>
                ))
            }
        </div>
    );
}

export default Bounties;
