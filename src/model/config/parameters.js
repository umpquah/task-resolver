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

    constructor(parentKey, details, otherVariables) {
        const key = `${parentKey}.params`;
        super(key, details);
        this._loadDetails(key, details, otherVariables);
    }

    _loadDetails(parentKey, details, otherVariables) {
        for (const parameterType in details) {
            // const globalNames = Object.keys(globals);
            const groupConfig = new VariableGroupConfig(
                `${parentKey}.${parameterType}`,
                details[parameterType],
                variableClassForParameterType(parameterType),
                otherVariables,
            );
            for (const variableName in groupConfig) {
                // if (variableName in this)
                //     throw new ConfigError(`${parentKey}: Duplicate use of '${variableName}'`);
                this[variableName] = groupConfig[variableName];
            }
        }
    }

    reset() {
        Object.values(this).forEach((paramVariable) => {
            paramVariable.reset();
        })
    }
}
