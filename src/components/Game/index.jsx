import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import StageUI from "../StageUI";

const Game = ({ config, setConfig, setError }) => {  

  const [stage, setStage] = useState(null)
  const [started, setStarted] = useState(false);

  // load initialStage
  useEffect(() => {
    if (config && !started) {
      setStarted(true);
      setStage(config.initialStage);
    }
  }, [config, started])

  const handleTransition = (result) => {
    const newStage = config.stages[stage].next(result);
    setStage(newStage);
  }

  const stageConfig = config ? config.stages[stage] : null;
  return (
    <Container>
      {stageConfig &&
        <StageUI stageConfig={stageConfig} whenDone={handleTransition} />
      }
    </Container>
  );
};
  
export default Game;