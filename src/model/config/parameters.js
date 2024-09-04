import ConfigComponent from "./component.js";
import VariableGroupConfig from "./variable-group.js";
import { BoolVariable, RangeVariable, SelectVariable, StaticVariable } from "../variable/index.js";
import { ConfigError } from "../error.js";


const PARAMETER_TYPE_MAP  = {
    "bool": BoolVariable,
    "range": RangeVariable,
    "select": SelectVariable,
    "static": StaticVariable,
}

const variableClassForParameterType = (paramType) => {
    return PARAMETER_TYPE_MAP[paramType];
}

export default class ParametersConfig extends ConfigComponent {
    static optionalProps = ["static", "range", "select", "bool"];

    constructor(parentKey, details, globals) {
        const key = `${parentKey}.params`;
        super(key, details);
        this._loadDetails(key, details, globals);
    }

    _loadDetails(parentKey, details, globals) {
        for (const parameterType in details) {
            const globalNames = Object.keys(globals);
            const groupConfig = new VariableGroupConfig(
                `${parentKey}.${parameterType}`,
                details[parameterType],
                variableClassForParameterType(parameterType),
            );
            for (const variableName in groupConfig) {
                console.log("Checking " + variableName);
                if (variableName in this)
                    throw new ConfigError(`${parentKey}: Duplicate use of '${variableName}'`);
                if (globalNames.includes(variableName))
                    throw new ConfigError(`${parentKey}: '${variableName}' already declared in global params`);
                this[variableName] = groupConfig[variableName];
            }
        }
    }

    refresh() {
        Object.values(this).forEach((paramVariable) => {
            paramVariable.refresh();
        })
    }
}
