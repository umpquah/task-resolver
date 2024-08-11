import Stage from "./stage.js";


export default class GameState {
    constructor(details) {
        const stageKeys = Object.keys(details);
        this.stages = {}
        this.initialStageKey = null;
        stageKeys.forEach((stageKey) => {
            const stage = new Stage(
                stageKey,
                details[stageKey]
            );
            if (stage.initialStage) {
                if (this.initialStageKey === null)
                    this.initialStageKey = stageKey;
                else
                    throw new ConfigError(`Stages ${this.initialStageKey} and ${stageKey} both marked as initial`);
            }
            this.stages[stageKey] = stage;
        });
        if (this.initialStageKey === null)
            throw new ConfigError("No stage specified as initial stage");

        this.stage = this.stages[this.initialStageKey];
    }

    runStage() {
        const resolution = this.stage.resolution;
        let out = {}
        Object.keys(resolution).forEach((key) => {
            if (key !== "next")
                out[key] = resolution[key].value;
        });
        this.stage = this.stages[resolution.next.value];
        this.stage.refresh();
        return out;
    }
}
