import { BoolVariable, DerivedVariable, RangeVariable, SelectVariable, StaticVariable } from "./variable.js";
import { ConfigError } from "./error.js";

const VARIABLE_TYPE_MAP  = {
    "bool": BoolVariable,
    "range": RangeVariable,
    "select": SelectVariable,
    "static": StaticVariable,
}

const RESERVED_NAMES = [
    "static", "range", "select", "bool", "next",
    "announce", "action", "wait"
];


class ConfigComponent {
    static requiredProps = [];
    static optionalProps = [];

    constructor(parentKey, details) {
        if (this.constructor == ConfigComponent) {
            throw Error("ConfigComponent is abstract");
        }
        this._validateProps(parentKey, details);
    }

    _validateProps(parentKey, details) {
        const required = this.constructor.requiredProps;
        const optional = this.constructor.optionalProps;
        if (required.length == 0 && optional.length == 0)
            return;
        for (const prop in details)
            if (!required.includes(prop) && !optional.includes(prop))
                throw new ConfigError(`${parentKey}: '${prop}' entry not allowed here`);
        for (const prop of required) {
            if (!(prop in details))
                throw new ConfigError(`${parentKey}: Missing required '${prop}' entry`);
        }
    }

    _validateVariableName(parentKey, variableName) {
        const required = this.constructor.requiredProps;
        const optional = this.constructor.optionalProps;
        if (required.includes(variableName) || optional.includes(variableName))
            return;
        if (RESERVED_NAMES.includes(variableName))
            throw new ConfigError(`${parentKey}: Cannot use reserved name '${variableName}' here`);
    }
};

class VariableGroupComponent extends ConfigComponent {
    constructor(parentKey, details, variableClass, varInitArg ) {
        super(parentKey, details);
        this._loadDetails(parentKey, details, variableClass, varInitArg);
    }

    _loadDetails(parentKey, details, variableClass, varInitArg) {
        for (const variableName in details) {
            this._validateVariableName(parentKey, variableName);
            const key = `${parentKey}.${variableName}`;
            this[variableName] = new variableClass(key, details[variableName], varInitArg);
        }
    }
}

export class ParametersComponent extends ConfigComponent {
    static optionalProps = ["static", "range", "select", "bool"];

    constructor(parentKey, details) {
        const key = `${parentKey}.params`;
        super(key, details);
        this._loadDetails(key, details);
    }

    _loadDetails(parentKey, details) {
        for (const variableType in details) {
            const groupComponent = new VariableGroupComponent(
                `${parentKey}.${variableType}`,
                details[variableType],
                VARIABLE_TYPE_MAP[variableType],
            );
            for (const variableName in groupComponent) {
                this[variableName] = groupComponent[variableName];
            }
        }
    }
}

export class CalculationsComponent extends VariableGroupComponent {
    constructor(parentKey, details, priorVariables) {
        super(`${parentKey}.calculations`, details, DerivedVariable, priorVariables);
    }
}

export class ResolutionComponent extends VariableGroupComponent {
    static requiredProps = ["next"];
    static optionalProps = ["announce", "action", "wait"];

    constructor(parentKey, details, priorVariables) {
        super(`${parentKey}.resolution`, details, DerivedVariable, priorVariables);
    }

    _validateProps(parentKey, details) {
        super._validateProps(parentKey, details);
        // extra check: "optional" props here are actually "at least one of"
        for (let prop of ResolutionComponent.optionalProps)
            if (prop in details)
                return;
        throw new ConfigError(
            `${parentKey} must specify at least one: ${ResolutionComponent.optionalProps.join(', ')}`);
    }

}


class StageComponent extends ConfigComponent {
    static requiredProps = ["label", "params", "results", "resolution"];
    static optionalProps = ["initialStage"];

    _loadProps(details) {
        this.initialStage = ("initialStage" in details);
        this.label = details.label;
    }

}



