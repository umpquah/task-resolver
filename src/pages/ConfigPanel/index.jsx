import { useState } from "react";
import { Container } from "react-bootstrap";
import MessageBanner from "../../components/MessageBanner";

const ConfigPanel = ({ config, setConfig, setError }) => {  
  const [message, setMessage] = useState("");

  return (
    <Container fluid>
      <MessageBanner message={message} isError={false} />
      <pre>
        {config && config.json}
      </pre>
    </Container>
  );
};
  
export default ConfigPanel;