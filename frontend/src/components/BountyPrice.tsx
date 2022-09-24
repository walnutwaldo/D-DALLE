

function BountyPrice({ price }: { price: number }) {
    return <div className="text-5xl text-bold grid place-items-center w-64">
        <div className="flex flex-row items-end">
            <div className="text-5xl text-bold">{price} </div>
            <div className="text-xl text-bold pl-2 pb-2">KLAY</div>
        </div>
    </div >
}

export default BountyPrice;