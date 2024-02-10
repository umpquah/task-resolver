import { useEffect, useState } from "react";
import { Button, Container, ProgressBar, Spinner } from "react-bootstrap";
import Instructions from "../Instructions";

const ROLLING_DELAY = 500;
const SECOND_DELAY = 10;

const Stage = ({
  stageConfig: {
    settings: {
      name,
      startPhrase,
      instruction,
      usesTimer,
      durationMultiplier,
      hasTask,
      endPhrase,
    },
    result,
    formatResult
  },
  whenDone
}) => {  
  const [started, setStarted] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [duration, setDuration] = useState(0);
  const [timer, setTimer] = useState(null);
  const [resultValue, setResultValue] = useState("");

  useEffect(() => {
    setResultValue(result());
  }, [result])

  const reset = () => {
    setStarted(false);
    setCompleted(false);
    setResultValue("");
  }

  const handleStartStage = () => {
    setStarted(true);
    setRolling(true);
    setTimeout(handleEndRolling, ROLLING_DELAY);
  };

  const handleEndRolling = () => {
    setRolling(false);
    if (!durationMultiplier) {
      setCompleted(true);
    } else {
      startTimer();
    }
  };

  const tick = () => {
    setTimeRemaining((t) => {
      if (t === 0) {
        clearInterval(timer);
        setCompleted(true);
        return t;
      } else {
        return t - 1;
      }
    });
  };

  const handleDone = () => {
    reset();
    whenDone(resultValue);
  }

  const startTimer = () => {
    const timer = setInterval(tick, SECOND_DELAY);
    const seconds = resultValue * durationMultiplier;
    setTimeRemaining(seconds);
    setDuration(seconds);
    setTimer(timer);
  };

  return (
    <Container className="stage">
      <div className="banner">
        Stage:{" "}
        <span className="name">{name}</span>
      </div>
      {!started &&
        <Button className="roll" onClick={handleStartStage}>
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
          <Instructions message={instruction} result={formatResult(resultValue)} />
          {usesTimer &&
            <div>
              <ProgressBar now={100 - 100 * timeRemaining / duration} />
            </div>
          } 
        </div>
      }
      {(started && !rolling && completed) &&
        <div className="complete">
          {hasTask &&
            <div className="plain">
              Once you have done that:
            </div>
          }
          <Button onClick={handleDone}>
            {endPhrase}
          </Button>
        </div>
      }
    </Container>
  );
};
  
export default Stage;