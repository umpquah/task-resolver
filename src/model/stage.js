import { CalculationsConfig, ConfigComponent, ParametersConfig, ResolutionConfig } from "./config/index.js";
import { ConfigError, StageError } from "./error.js";
import BUILTIN_FUNCTIONS from "./builtins.js";

export const StageStatus = Object.freeze({
    INITIAL: "initial",
    WAITING: "waiting",
    ACTING: "acting",
    FINISHED: "finished",
});

export default class Stage extends ConfigComponent {
    static requiredProps = ["label", "parameters", "calculations", "resolution"];
    static optionalProps = ["initial"];

    constructor(parentKey, details) {
        super(parentKey, details);
        this._loadDetails(parentKey, details);
        this.key = parentKey;
        this.reset();
    }

    _loadDetails(parentKey, details) {
        this.label = details.label;
        this.isInitial = details.initial;
        this.parameters = new ParametersConfig(
            parentKey,
            details.parameters
        );
        this.calculations = new CalculationsConfig(
            parentKey,
            details.calculations,
            Object.values(this.parameters).concat(BUILTIN_FUNCTIONS)
        );
        // Check for duplicates
        const parameterNames = Object.values(this.parameters).map(p => p.name);
        Object.values(this.calculations).forEach((calc) => {
            if (parameterNames.includes(calc.name))
                throw new ConfigError(`Duplicate use of '${calc.name}'`);
        });
        this.resolution = new ResolutionConfig(
            parentKey,
            details.resolution,
            [...Object.values(this.parameters), ...Object.values(this.calculations)]
        );
    }

    _validateMethod(methodName, expectedStatus) {
        if (this.state.status != expectedStatus) 
            throw new StageError(`${this.key}: ${methodName}() not valid at this time`);
    }

    resolve() {
        this._validateMethod("resolve", StageStatus.INITIAL);
        const { announce, action, wait } = this.resolution;
        this.state.announce = announce.value;
        if (action) {
            this.state.status = StageStatus.ACTING;
            this.state.action = this.resolution.action.value;
        } else if (wait) {
            this.state.status = StageStatus.WAITING;
            this.state.timer = {duration: this.resolution.wait.value, ellapsed: 0};
        } else {
            this._finish();
        }
        return this.state;
    }

    userActionDone() {
        this._validateMethod("userActionDone", StageStatus.ACTING);
        this._finish();
        return this.state;
    }

    advanceTimer() {
        this._validateMethod("advanceTimer", StageStatus.WAITING);
        const { timer } = this.state;
        timer.ellapsed += 1;
        if (timer.duration == timer.ellapsed) 
            this._finish();
        return this.state;
    }

    _finish() {
        this.state.status = StageStatus.FINISHED;
        this.state.next = this.resolution.next.value;
    }

    reset() {
        this.parameters.refresh();
        this.state = {label: this.label, status: StageStatus.INITIAL};
        return this.state;
    }

    show() {
        ["parameters", "calculations", "resolution"].forEach((confType) => {
            console.log(`${confType[0].toUpperCase()}${confType.slice(1)}`);
            Object.keys(this[confType]).forEach((key) => {
                console.log(`  ${key}: ${this[confType][key].value}`);
            });
        })
    }

}
