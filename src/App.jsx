import { useEffect, useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import Config, { ConfigError, DEFAULT_CONFIG_JSON, SFW_LEXICON } from "./config";
import Game from "./pages/Game";
import ConfigPanel from "./pages/ConfigPanel"
import MessageBanner from "./components/MessageBanner";
import './style.scss';

const App = () => {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const initialConfig = new Config(DEFAULT_CONFIG_JSON(SFW_LEXICON));
      setConfig(initialConfig);
    } catch (e) {
      if (e instanceof ConfigError) {
        setError(["Configuration Problem", e.message]);
      } else {
        setError([`Unexpected Error - ${e.name}`, e.message]);
      }
    }
  }, []);

  return (
    <Container id="main">
      <MessageBanner message={error} isError={true} />
      <Tabs fill defaultActiveKey="game">
        <Tab eventKey="game" title="Game">
          <Game config={config} setConfig={setConfig} setError={setError} />
        </Tab>
        <Tab eventKey="config-panel" title="Config">
          <ConfigPanel config={config} setConfig={setConfig} setError={setError} />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default App;
