import React from 'react';
import GlobalDataContext from '../contexts/GlobalDataContext';
import Bounty from './Bounty';
import {useNavigate} from "react-router-dom";

function Bounties() {
    const {globalData} = React.useContext(GlobalDataContext);

    const navigate = useNavigate();
    const sel_bounty = (id: string) => {
        navigate("/propose/" + id);
    };
    return (
        <div>
            <div className={
                "p-2 bg-slate-700 m-4 text-white rounded-lg gap-4"
            }>
                <div className="flex flex-row">
                    <div className="w-64 text-center font-bold">
                        Bounty
                    </div>
                    <div className="w-64 text-center font-bold">
                        Prompt
                    </div>
                    <div className="flex-1 text-center font-bold">
                        Submissions
                    </div>
                </div>
            </div>
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
