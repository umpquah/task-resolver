import ConfigComponent from "./component.js";
import VariableGroupConfig from "./variable-group.js";
import { BoolVariable, RangeVariable, SelectVariable, StaticVariable } from "../variable/index.js";


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

    constructor(parentKey, details) {
        const key = `${parentKey}.params`;
        super(key, details);
        this._loadDetails(key, details);
    }

    _loadDetails(parentKey, details) {
        for (const parameterType in details) {
            const groupConfig = new VariableGroupConfig(
                `${parentKey}.${parameterType}`,
                details[parameterType],
                variableClassForParameterType(parameterType),
            );
            for (const variableName in groupConfig) {
                if (variableName in this)
                    throw new ConfigError(`Duplicate use of '${variableName}'`);
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
