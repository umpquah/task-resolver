import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const Test = () => {
    const [timer, setTimer] = useState(null);
    const [count, setCount] = useState(0);

    const tick = () => {
        setCount((oldCount) => oldCount + 1);
    }

    const toggleTimer = () => {
        if (!timer) {
            setTimer(setInterval(tick, 1000));
        } else {
            clearInterval(timer);
            setTimer(null);
        }
    }


    return (
        <div>
            <div>{count}</div>
            <Button
                onClick={toggleTimer}
            >
                {timer ? 'Stop' : 'Start'}
            </Button>
        </div>
    )
};

export default Test;
