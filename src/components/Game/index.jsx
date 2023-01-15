import { useState } from "react";
import { Alert, Container } from "react-bootstrap";
import Stage from "../Stage";
import ResultInstruction from "../ResultInstruction";
import MessageBanner from "../MessageBanner";

const formatQuantity = (value, unitName) => {
  let lastLetter = unitName.charAt(unitName.length - 1);
  let ustr = (value === 1 && lastLetter === "s") 
    ? unitName.substring(0, unitName.length - 1)
    : unitName;
  return `${value} ${ustr}`;
};

const Game = ({ config, setConfig }) => {  
  const [stage, setStage] = useState("Wait");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("");

  const handleNextStage = ({ lastResult }) => {
    setStatus("Ended");
  };

  const renderStageComponent = () => {
    if (!config) 
      return null;
    console.log(config);
    return (
      <Stage
        name="Wait"
        startPhrase="Roll"
        resultInstruction={
          <ResultInstruction instruction="Wait for [] now." quantity="2 minutes" />
        }
        duration={120}
        hasTask={false}
        endPhrase="Continue"
        whenDone={handleNextStage}
      />
    )
  }

  return (
    <Container>
      <MessageBanner message={status} isError={false} />
      {renderStageComponent()}
    </Container>
  );
};
  
export default Game;