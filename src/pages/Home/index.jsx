import { useEffect, useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import Game from "../Game";
import ConfigPanel from "../ConfigPanel"
import Config, { DEFAULT_CONFIG } from "../../config"; 
import './style.scss';

const Home = () => {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const initialConfig = new Config(DEFAULT_CONFIG);
    setConfig(initialConfig);
  }, []);

  return (
    <Container id="main">
      <Tabs fill>
        <Tab eventKey="game" title="Game">
          <Game config={config} />
        </Tab>
        <Tab eventKey="config-panel" title="Config">
          <ConfigPanel config={config} setConfig={setConfig} />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default Home;
