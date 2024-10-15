import { useState } from "react";
import { Container } from "react-bootstrap";
import Banner from "../../components/banner";

const ConfigPanel = ({ config, setConfig, setError }) => {  
  const [message, setMessage] = useState("");

  return (
    <Container fluid>
      <Banner message={message} isError={false} />
      <pre>
        {config && config.json}
      </pre>
    </Container>
  );
};
  
export default ConfigPanel;