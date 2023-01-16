import { Container } from "react-bootstrap";

const ConfigPanel = ({ config, setConfig, setError }) => {  
  return (
    <Container>
      { config && 
        <pre>
          {config.json}
        </pre>
      }
    </Container>
  );
};
  
export default ConfigPanel;