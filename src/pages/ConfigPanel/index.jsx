import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import Config, { ConfigError, DEFAULT_CONFIG_JSON, SFW_LEXICON, OM_LEXICON } from "../../config";
import MessageBanner from "../../components/MessageBanner";

const ConfigPanel = ({ config, setConfig, setError }) => {  
  const [message, setMessage] = useState("");
  const handleSwitchTasks = (sfw) => {
    const lexicon = sfw ? SFW_LEXICON : OM_LEXICON;
    const updatedConfig = new Config(DEFAULT_CONFIG_JSON(lexicon));
    setConfig(updatedConfig);
    setMessage(["OK", "Tasks updated."]);
  };

  return (
    <Container fluid>
      <div className="d-flex" style={{justifyContent: "space-around"}}>
        <Button onClick={() => handleSwitchTasks(true)}>
          Use SFW Tasks
        </Button>
        <Button onClick={() => handleSwitchTasks(false)}>
          Use Other Tasks
        </Button>
      </div>
      <MessageBanner message={message} isError={false} />
      {/* <pre>
        {config.json}
      </pre> */}
    </Container>
  );
};
  
export default ConfigPanel;