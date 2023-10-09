import { useState } from "react";
import { Container } from "react-bootstrap";
import MessageBanner from "../../components/MessageBanner";

const ConfigPanel = ({ config, setConfig, setError }) => {  
  const [message, setMessage] = useState("");

  return (
    <Container fluid>
      {/* <div className="d-flex" style={{justifyContent: "space-around"}}>
        <Button onClick={() => handleSwitchTasks(true)}>
          Use SFW Tasks
        </Button>
        <Button onClick={() => handleSwitchTasks(false)}>
          Use Other Tasks
        </Button>
      </div> */}
      <MessageBanner message={message} isError={false} />
      <pre>
        {config && config.json}
      </pre>
    </Container>
  );
};
  
export default ConfigPanel;