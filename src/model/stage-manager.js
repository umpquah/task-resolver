import Stage from "./stage.js";
import { ParametersConfig } from "./config/index.js";
import { ConfigError } from "./error.js";

export default class StageManager {
    constructor(details) {
        const { parameters, stages: allStages } = details;
        const globals = new ParametersConfig("parameters", parameters, []);
        this.stages = {}
        this.initialStageKey = null;
        Object.entries(allStages).forEach(([stageKey, stageDetails]) => {
            const stage = new Stage(stageKey, stageDetails, globals ?? {});
            if (stage.isInitial) {
                if (this.initialStageKey === null)
                    this.initialStageKey = stageKey;
                else
                    throw new ConfigError(`Stages ${this.initialStage.key} and ${stageKey} both marked as initial`);
            }
            this.stages[stageKey] = stage;
        });
        if (this.initialStageKey === null)
            throw new ConfigError("No stage specified as initial stage");
        this.reset();
    }

    reset() {
        this.currentStage = this.stages[this.initialStageKey];
        this.currentStage.reset();
        this.currentState = this.currentStage.state;
        this.states = [this.currentState];
    }

    resolve() {
        const { label } = this.currentStage;
        this.currentState = this.currentStage.resolve();
        const next = this.currentStage.resolution.next.value;
        if (!(next in this.stages))
            throw new ConfigError(`${label} resolved with invalid next key ${next}`);
    }

    userActionDone() {
        this.currentState = this.currentStage.userActionDone();
    }

    advanceTimer() {
        this.currentState = this.currentStage.advanceTimer();
    }

    transitionStage() {
        const { next } = this.currentState;
        if (next == this.initialStageKey)
            this.reset();
        else {
            this.currentStage = this.stages[next];            
            this.currentState = this.currentStage.reset();
            this.states.push(this.currentState);
        }
    }

    log() {
        this.states.forEach((state) => {
            console.log(state);
        });
        console.log("=============================");
    }
}