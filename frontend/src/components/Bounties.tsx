import React from 'react';
import { BountyT } from '../types.tsx/types';
import Bounty from './Bounty';


const toy_data = [
    {
        "id": "abcdef",
        "user": "0x1234567890",
        "bounty": 125,
        "deadline": 1664136575,
        "prompt": "Elephants in space",
        "submissions": [
            { "user": "0x4242424242", "image": "https://openai-labs-public-images-prod.azureedge.net/user-WAOFRt6Xqw1eXVzsqjHrsvbg/generations/generation-CmovJQoXMMTLc6iBGOzyKZSi/image.webp" },
            { "user": "0x4242424242", "image": "https://openai-labs-public-images-prod.azureedge.net/user-WAOFRt6Xqw1eXVzsqjHrsvbg/generations/generation-CmovJQoXMMTLc6iBGOzyKZSi/image.webp" },
        ],
    },
    {
        "id": "abcdef",
        "user": "0x1234567890",
        "bounty": 85,
        "deadline": 1664126575,
        "prompt": "Rainbow cats and goldfish",
        "submissions": [
            { "user": "0x4242424242", "image": "https://openai-labs-public-images-prod.azureedge.net/user-WAOFRt6Xqw1eXVzsqjHrsvbg/generations/generation-CmovJQoXMMTLc6iBGOzyKZSi/image.webp" },
            { "user": "0x4242424242", "image": "https://openai-labs-public-images-prod.azureedge.net/user-WAOFRt6Xqw1eXVzsqjHrsvbg/generations/generation-CmovJQoXMMTLc6iBGOzyKZSi/image.webp" },
        ],
    },
];

function Bounties() {
    const [data, setData] = React.useState(toy_data as BountyT[]);

    return (
        <div>
            {data.map((bounty) => <Bounty data={bounty} />)}
        </div>
    );
}

export default Bounties;