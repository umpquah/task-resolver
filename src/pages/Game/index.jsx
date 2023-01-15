import { useEffect, useState } from "react";
import { Alert, Container } from "react-bootstrap";
import Config, { DEFAULT_CONFIG } from "../../config"; 
import Stage from "../../components/Stage";
import ResultInstruction from "../../components/ResultInstruction";

const MessageBanner = ({ message, isError }) => {
  return (
    message 
    ? <Alert variant={ isError ? "danger" : "primary" }>
        {message}
      </Alert>
    : "" 
  );
};

const Game = ({ config, setConfig }) => {  
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [stage, setStage] = useState("Wait");

  useEffect(() => {
    try {
      const initialConfig = new Config(DEFAULT_CONFIG);
      setConfig(initialConfig);
    } catch (e) {
      setError(e.toString());
    }
  }, []);

  const handleStageFinish = () => {
    console.log("Ok, stage finished!");
  };

  return (
    <Container>
      <MessageBanner message={status} isError={false} />
      <MessageBanner message={error} isError={true} />
      <Stage
        name="Setup"
        startPhrase="Start"
        resultInstruction={
          <ResultInstruction phrase="You must eat" quantity="5 lemons" />
        }
        hasTask={true}
        endPhrase="Done"
        whenDone={handleStageFinish}
      />
      <Stage
        name="Test"
        startPhrase="Roll"
        resultInstruction={
          <ResultInstruction phrase="Winner!" />
        }
        hasTask={false}
        endPhrase="Done"
        whenDone={handleStageFinish}
      />
      <Stage
        name="Countdown"
        startPhrase="Roll"
        resultInstruction={
          <ResultInstruction phrase="Duration is" quantity="1 minute" />
        }
        endPhrase="Continue"
        duration={10}
        whenDone={handleStageFinish}
      />
    </Container>
  );
};
  
export default Game;