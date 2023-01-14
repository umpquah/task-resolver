import { Container } from "react-bootstrap";

const ConfigPanel = ({ config, setConfig }) => {  
  return (
    <Container>
      { config && 
        <pre>
          {JSON.stringify(config.data, null, 2)}
        </pre>
      }
    </Container>
  );
};
  
export default ConfigPanel;