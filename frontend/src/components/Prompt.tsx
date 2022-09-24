
import { FaQuoteLeft } from 'react-icons/fa';


function Prompt({ prompt }: { prompt: string }) {
    return (
        <div className="flex flex-col items-center grow justify-center">
            <FaQuoteLeft size={36} />
            <div className="text-2xl text-bold pl-2 text-center">{prompt}</div>
        </div >
    );
}

export default Prompt;