import React from 'react';
import GlobalDataContext from '../contexts/GlobalDataContext';
import Bounty from './Bounty';

function Bounties() {
    const {globalData} = React.useContext(GlobalDataContext);

    return (
        <div>
            <div className={
                "p-2 bg-slate-700 m-4 text-white rounded-lg"
            }>
                <div className="flex flex-row gap-4">
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
                    <div key={bounty.id} className={
                        "p-2 m-4"
                    }>
                        <Bounty data={bounty}/>
                    </div>
                ))
            }
        </div>
    );
}

export default Bounties;
