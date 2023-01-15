import { useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import Game from "../Game";
import ConfigPanel from "../ConfigPanel"
import './style.scss';

const Home = () => {
  const [config, setConfig] = useState(null);

  return (
    <Container id="main">
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

export default Home;
