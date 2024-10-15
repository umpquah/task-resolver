import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Stage from "../../components/stage";

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

  // const handleTransition = (result) => {
  //   const newStage = config.stages[stage].next(result);
  //   setStage(newStage);
  // }
  const handleTransition = (result) => {

  };

  // const stageConfig = config ? config.stages[stage] : null;
  const names = ["wait", "decide", "reward", "penalty"];

  return (
    <Container>
      {config &&
          names.map((name) => (
            <Stage stageConfig={config.stages[name]} whenDone={handleTransition} />
          ))
      }
    </Container>
  );
};
  
export default Game;