import Stage from "./stage.js";
import { ConfigError } from "./error.js";

export default class StageManager {
    constructor(details) {
        const stageKeys = Object.keys(details);
        this.stages = {}
        this.initialStage = null;
        stageKeys.forEach((stageKey) => {
            const stage = new Stage(
                stageKey,
                details[stageKey]
            );
            if (stage.isInitial) {
                if (this.initialStage === null)
                    this.initialStage = stage;
                else
                    throw new ConfigError(`Stages ${this.initialStage.key} and ${stageKey} both marked as initial`);
            }
            this.stages[stageKey] = stage;
        });
        if (this.initialStageKey === null)
            throw new ConfigError("No stage specified as initial stage");

        this.activeStages = [this.initialStage];
        this.currentStage = this.initialStage;
    }

    resolveCurrentStage() {
        const results = this.currentStage.resolve();
        console.log("Stage resolution:");
        Object.entries(results).forEach(([key, value]) => {
            console.log(`  ${key}: ${value.toString()}`);
        });
    }

    // doStageTransition() {
    //     this.stage = this.nextStage;
    //     this.stage.refresh();
    //     this.nextStage = null;
    //     if (this.stage === this.initialStage)
    //         this.activeStages = [this.stage];
    //     else
    //         this.activeStages.push(this.stage);
    // }

    _show(stage) {
        console.log(`${stage.label}: ${stage.status.description}`);
        if (stage.results) {
            Object.keys(stage.results).forEach((key) => {
                console.log(`  ${key}: ${stage.results[key]}`);
            });
        }
    }
    showCurrentStage() {
        this._show(this.currentStage);
    }

    showAllStages() {
        this.activeStages.forEach((stage) => {
            this._show(stage);
        })
        console.log();
    }
}
