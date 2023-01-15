import { useState } from "react";
import { Button, Container, Spinner } from "react-bootstrap";

const ROLLING_DELAY = 500;

const Stage = ({
  name,
  startPhrase,
  resultInstruction,
  duration,
  hasTask,
  endPhrase,
  whenDone 
}) => {  
  const [started, setStarted] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [timer, setTimer] = useState(null);

  const handleStart = () => {
    setStarted(true);
    setRolling(true);
    setTimeout(resultReady, ROLLING_DELAY);
  };

  const resultReady = () => {
    setRolling(false);
    if (!duration) {
      setCompleted(true);
    } else {
      runTimer();
    }
  };

  const tick = () {
    if (timeRemaining == 0) {
      clearInterval(timer);
      setCompleted(true);
    } else {
      setTimeRemaining((t) => (t - 1));
    }
  }

  const runTimer = () => {
    const timer = setInterval(tick, 1000);
    setTimer(timer);
  }

  return (
    <Container className="stage">
      <div className="banner">
        Stage:{" "}
        <span className="name">{name}</span>
      </div>
      {!started &&
        <Button onClick={handleStart}>
          {startPhrase}
        </Button>
      }
      {rolling && 
        <div className="roll">
          <Spinner animation="border" />
        </div>
      }
      {(started && !rolling) && 
        <div className="resultMsg">
          Result:<br />
          {resultInstruction}
        </div>
      }
      {(started && !rolling && completed) &&
        <div>
          {hasTask &&
            <div className="plain">
              Complete the task, then click to continue:
            </div>
          }
          <Button onClick={whenDone}>
            {endPhrase}
          </Button>
        </div>
      }
    </Container>
  );
};
  
export default Stage;