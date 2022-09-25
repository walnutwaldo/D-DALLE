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
                    <div key={bounty.id} onClick={() => sel_bounty(bounty.id)}
                        className="hover:cursor-pointer">
                        <Bounty data={bounty} />
                    </div>
                ))
            }
        </div>
    );
}

export default Bounties;
