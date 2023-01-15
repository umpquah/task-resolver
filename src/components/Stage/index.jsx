import { useState } from "react";
import { Button, Container, ProgressBar, Spinner } from "react-bootstrap";

const ROLLING_DELAY = 500;
// const SECOND_DELAY = 1000;
const SECOND_DELAY = 100;

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
  const [timeRemaining, setTimeRemaining] = useState(duration ? duration : 0);
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

  const tick = () => {
    setTimeRemaining((t) => {
      if (t == 0) {
        clearInterval(timer);
        setCompleted(true);
        return t;
      } else {
        return t - 1;
      }
    });
  };

  const runTimer = () => {
    const timer = setInterval(tick, SECOND_DELAY);
    setTimer(timer);
  };

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
          {duration &&
            <div>
              <ProgressBar now={100 - 100 * timeRemaining / duration} />
            </div>
          } 
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