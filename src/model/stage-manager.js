import StageConfig from "./stage.js";
import { ParametersConfig } from "./config/index.js";
import { ConfigError } from "./error.js";

export default class StageManager {
    constructor(details) {
        this._loadDetails(details);
        this._setCurrentStageByKey(this.initialStageKey);
    }

    _loadDetails(details) {
        const { parameters, stages: allStages } = details;
        const globals = new ParametersConfig("parameters", parameters, []);
        this.stages = {}
        this.initialStageKey = null;
        Object.entries(allStages).forEach(([stageKey, stageDetails]) => {
            const stage = new StageConfig(stageKey, stageDetails, globals ?? {});
            if (stage.isInitial) {
                if (this.initialStageKey === null)
                    this.initialStageKey = stageKey;
                else
                    throw new ConfigError(`Stages ${this.initialStageKey} and ${stageKey} both marked as initial`);
            }
            this.stages[stageKey] = stage;
        });
        if (this.initialStageKey === null)
            throw new ConfigError("No stage specified as initial stage");
        
    }

    _setCurrentStageByKey(stageKey) {
        this.currentStage = this.stages[stageKey];
        this.currentStage.reset();
        return this.currentStage.state;
    }

    resolveCurrentStage() {
        const state = this.currentStage.resolve(Object.keys(this.stages));
        return state;
    }

    userActionDone() {
        return this.currentStage.userActionDone();
    }

    advanceTimer() {
        return this.currentStage.advanceTimer();
    }

    advanceToNextStage() {
        const { next } = this.currentStage.state;
        return this._setCurrentStageByKey(next);
    }
}