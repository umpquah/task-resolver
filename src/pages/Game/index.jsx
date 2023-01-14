import { useState } from "react";
import { Alert, Button, Container } from "react-bootstrap";

const Report = ({ message, isError }) => {
  return (
    message 
    ? <Alert variant={ isError ? "danger" : "primary" }>
        {message}
      </Alert>
    : "" 
  );
};

const Game = ({ config }) => {  
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleClick = () => {
    try {
      let result = config.evaluate("rewardResult");
      setStatus(`Time result: ${result}`);
    } catch (e) {
      setError(e.toString());
    }
  }

  return (
    <Container>
      <Button 
        variant="primary"
        onClick={handleClick}
      >
        Check Behavior
      </Button>
      <Report message={status} isError={false} />
      <Report message={error} isError={true} />
    </Container>
  );
};
  
export default Game;