import { ConfigComponent, ParametersConfig, CalculationsConfig, ResolutionConfig } from "./config.js";
import BUILTIN_FUNCTIONS from "./builtins.js";
import { ConfigError, StageError } from "./error.js";


export const StageStatus = Object.freeze({
    INITIAL: Symbol("initial"),
    WAITING: Symbol("waiting"),
    ACTING: Symbol("acting"),
    FINISHED: Symbol("finished"),
});

export default class Stage extends ConfigComponent {
    static requiredProps = ["label", "parameters", "calculations", "resolution"];
    static optionalProps = ["initial"];

    constructor(parentKey, details) {
        super(parentKey, details);
        this._loadDetails(parentKey, details);
        this.key = parentKey;
        this._refresh();
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
        if (this.status != expectedStatus) 
            throw new StageError(`${this.key}: ${methodName}() at this time`);
    }

    resolve() {
        this._validateMethod("resolve", StageStatus.INITIAL);
        let results = {}
        if ("action" in this.resolution) {
            this.status = StageStatus.ACTING;
            results.action = this.resolution.action.value;
        } else if ("wait" in this.resolution) {
            this.status = StageStatus.WAITING;
            results.wait = this.resolution.wait.value;
        } else {
            this.status = StageStatus.FINISHED;
            this.next = this.resolution.next.value;
        }
        results.announce = this.resolution.announce.value;
        results.status = this.status;
        return results;
    }

    userActionDone() {
        this._validateMethod("userActionDone", StageStatus.ACTING);
        this._finish();
    }

    _tick() {
        this._timer.ellapsed += 1;
        if (this._timer.duration == this._timer.ellapsed) {
            clearInterval(this._timer);
            this._finish();
        }
    }

    _startTimer(duration) {
        this._timer = setInterval(this._tick.bind(this), 1000);
        this.timer = {duration: duration, ellapsed: 0};
    }

    _finish() {
        this.status = StageStatus.FINISHED;

    }

    _refresh() {
        this.parameters.refresh();
        this.state = {};
        this.status = StageStatus.INITIAL;
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
