import { useEffect, useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import Config, { DEFAULT_CONFIG } from "./config";
import Game from "./components/Game";
import ConfigPanel from "./components/ConfigPanel"
import MessageBanner from "./components/MessageBanner";
import './style.scss';

const App = () => {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const initialConfig = new Config(DEFAULT_CONFIG);
      setConfig(initialConfig);
    } catch (e) {
      setError(e.toString());
    }
  }, []);

  return (
    <Container id="main">
      <MessageBanner message={error} isError={true} />
      <Tabs fill>
        <Tab eventKey="game" title="Game">
          <Game config={config} setConfig={setConfig} />
        </Tab>
        <Tab eventKey="config-panel" title="Config">
          <ConfigPanel config={config} setConfig={setConfig} />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default App;
