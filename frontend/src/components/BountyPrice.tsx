import { BigNumber, ethers } from "ethers";


function BountyPrice(props: { price: BigNumber }) {
    const { price } = props;

    return <div className="text-5xl text-bold grid place-items-center w-64 flex-shrink-0">
        <div className="flex flex-row items-end">
            <div className="text-5xl text-bold">{ethers.utils.formatEther(price)} </div>
            <div className="text-xl text-bold pl-2 pb-2">KLAY</div>
        </div>
    </div>
}

export default BountyPrice;