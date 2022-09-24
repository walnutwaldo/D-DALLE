
import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

const calc_time_left = (deadline: number) => {
    // unix timestamp to remaining seconds, minutes, hours, days
    const now = new Date().getTime() / 1000;
    const t_seconds = Math.floor(deadline - now);
    const t_minutes = Math.floor(t_seconds / 60);
    const t_hours = Math.floor(t_minutes / 60);
    const days = Math.floor(t_hours / 24);
    return { seconds: t_seconds % 60, minutes: t_minutes % 60, hours: t_hours % 24, days };
}


function Countdown({ deadline }: { deadline: number }) {
    const [time_left, setTimeLeft] = React.useState(calc_time_left(deadline));
    const { seconds, minutes, hours, days } = time_left;

    // update time left every second
    React.useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(calc_time_left(deadline));
        }, 1000);
        return () => clearInterval(interval);
    }, [deadline]);


    return (
        <div className="text-2xl font-black	text-center pt-3">
            {days > 0 && <span>{days}d </span>}
            {days + hours > 0 && <span>{hours > 9 ? hours : '0' + hours}:</span>}
            {days + hours + minutes > 0 && <span>{minutes > 9 ? minutes : '0' + minutes}:</span>}
            <span>{seconds > 9 ? seconds : '0' + seconds}</span>
        </div >
    );
}

export default Countdown;