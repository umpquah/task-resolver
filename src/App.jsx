import { useEffect, useState } from "react";
import { Button, Container, Tab, Tabs } from "react-bootstrap";
import { DEFAULT_SETTINGS_JSON } from "./settings/defaults";
import { ConfigError } from "./model/util/error";
import { StageStatus } from "./model/stage";
import Stage from "./components/stage";
import Game from "./pages/Game";
import ConfigPanel from "./pages/ConfigPanel"
import Banner from "./components/banner";
import './style.scss';
import StageManager from "./model/stage-manager";


const NORMAL_SECOND = 1000;
// const ONE_SECOND = NORMAL_SECOND;
const ONE_SECOND = 10;

const ROLLING_DELAY = 500;

const App = ({
  settings = DEFAULT_SETTINGS_JSON
}) => {
  const [stageManager, setStageManager] = useState(new StageManager(JSON.parse(settings)));
  const [states, setStates] = useState([stageManager.currentStage.state]);

  const roll = () => {

  };

  const advance = () => {
    const { status } = stageManager.currentStage.state;
    let state;
    if (status === StageStatus.LOADED) {
      state = stageManager.resolveCurrentStage();
    } else if (status === StageStatus.ACTING) {
      state = stageManager.userActionDone();
    } else if (status === StageStatus.WAITING) {
      state = stageManager.advanceTimer();
    } else if (status === StageStatus.FINISHED) {
      state = stageManager.advanceToNextStage();
    }
    if (state.initial)
      setStates([state]);
    else if (state.status === StageStatus.LOADED)
      setStates((states) => [...states, state]);
    else
      setStates((states) => [...states.slice(0, -1), state]);
  };

  const activeState = states[states.length - 1];

  return (
    <Container id="main">
      <Button
        onClick={advance}
      >
        Advance
      </Button>
      <div>
        {states.map((stageState) => (
          <Stage {...stageState} key={stageState.label} whenUserActionDone={advance}/>
        ))
        }
      </div>
      <pre>
        {JSON.stringify(activeState, null, 2)}
      </pre>
    {/*
      <Banner {...error} isError={true} />
      <Tabs fill defaultActiveKey="game">
        <Tab eventKey="game" title="Game">
          <Game config={config} setConfig={setConfig} setError={setError} />
        </Tab>
        <Tab eventKey="config-panel" title="Config">
          <ConfigPanel config={config} setConfig={setConfig} setError={setError} />
        </Tab>
      </Tabs>
      */}
    </Container>
  );
}

export default App;
