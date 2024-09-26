import { useEffect, useState } from "react";
import { Button, Container, Tab, Tabs } from "react-bootstrap";
import { DEFAULT_SETTINGS_JSON } from "./settings/defaults";
import { ConfigError } from "./model/error";
import { StageStatus } from "./model/stage";
import Stage from "./components/Stage";
import Game from "./pages/Game";
import ConfigPanel from "./pages/ConfigPanel"
import MessageBanner from "./components/MessageBanner";
import './style.scss';
import StageManager from "./model/stage-manager";

const App = ({
  settings = DEFAULT_SETTINGS_JSON
}) => {
  const [stageManager, setStageManager] = useState(new StageManager(JSON.parse(settings)));
  const [stageStates, setStageStates] = useState([stageManager.currentStage.state]);

  const advance = () => {
    const { status } = stageManager.currentStage.state;
    let state;
    if (status === StageStatus.LOADED) {
      state = stageManager.resolve();
    } else if (status === StageStatus.ACTING) {
      state = stageManager.userActionDone();
    } else if (status === StageStatus.WAITING) {
      state = stageManager.advanceTimer();
    } else if (status === StageStatus.FINISHED) {
      state = stageManager.transitionStage();
    }
    if (state.initial)
      setStageStates([state]);
    else if (state.status === StageStatus.LOADED)
      setStageStates((states) => [...states, state]);
    else
      setStageStates((states) => [...states.slice(0, -1), state]);
  };

  return (
    <Container id="main">
      <Button
        onClick={advance}
      >
        Advance
      </Button>
      <div>
        {stageStates.map((stageState) => (
          <Stage {...stageState} key={stageState.label}/>
        ))
        }
      </div>
    {/*
      <MessageBanner {...error} isError={true} />
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
