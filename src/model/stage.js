import { CalculationsConfig, ConfigComponent, ParametersConfig, ResolutionConfig } from "./config/index.js";
import { ConfigError, StageError } from "./util/error.js";
import BUILTIN_FUNCTIONS from "./util/builtins.js";

export const StageStatus = Object.freeze({
    LOADED: "loaded",
    WAITING: "waiting",
    ACTING: "acting",
    FINISHED: "finished",
});

export default class Stage extends ConfigComponent {
    static requiredProps = ["label", "parameters", "calculations", "resolution"];
    static optionalProps = ["initial"];

    constructor(parentKey, details, globals) {
        super(parentKey, details);
        this._loadDetails(parentKey, details, globals);
        this.key = parentKey;
        this.reset();
    }

    _loadDetails(parentKey, details, globals) {
        this.label = details.label;
        this.isInitial = details.initial;
        let variables = Object.values(globals);
        this.parameters = new ParametersConfig(
            parentKey,
            details.parameters,
            // using spread here and subsequently to make
            // a copy of the array each time
            [...variables],
        );
        variables.push(...Object.values(this.parameters), ...BUILTIN_FUNCTIONS);
        this.calculations = new CalculationsConfig(
            parentKey,
            details.calculations,
            [...variables],
        );
        variables.push(...Object.values(this.calculations));
        this.resolution = new ResolutionConfig(
            parentKey,
            details.resolution,
            [...variables],
        );
    }

    _validateMethod(methodName, expectedStatus) {
        if (this.state.status !== expectedStatus) 
            throw new StageError(`${this.key}: ${methodName}() not valid at this time`);
    }

    resolve(validStageKeys) {
        this._validateMethod("resolve", StageStatus.LOADED);
        const { announce, action, wait, next } = this.resolution;
        if (validStageKeys.length > 0 && !validStageKeys.includes(next.value))
            throw new ConfigError(`${this.key} resolved with invalid next key ${next.value}`);
        this.state.announce = announce.value;
        if (action) {
            this.state.status = StageStatus.ACTING;
            this.state.action = this.resolution.action.value;
        } else if (wait) {
            this.state.status = StageStatus.WAITING;
            this.state.wait = {duration: this.resolution.wait.value, elapsed: 0};
        } else {
            this.state.status = StageStatus.FINISHED;
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
        const { wait } = this.state;
        wait.elapsed += 1;
        if (wait.duration === wait.elapsed) 
            this._finish();
        return this.state;
    }

    reset() {
        this.parameters.reset();
        this.state = {label: this.label, status: StageStatus.LOADED};
        if (this.isInitial)
            this.state.initial = true;
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

    _finish() {
        this.state.status = StageStatus.FINISHED;
        this.state.next = this.resolution.next.value;
    }

}
