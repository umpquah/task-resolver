import { ConfigError } from "../util/error.js";
import ConfigComponent from "./component.js";

const RESERVED_NAMES = [
    "parameters", "calculations", "resolution",
    "static", "range", "select", "bool",
    "announce", "action", "next",
];


export default class VariableGroupConfig extends ConfigComponent {
    constructor(parentKey, details, variableClass, otherVariables) {
        super(parentKey, details);
        const otherVariableNames = otherVariables.map((v) => v.name);
        for (const variableName in details) {
            this._validateVariableName(parentKey, variableName, otherVariableNames);
            const key = `${parentKey}.${variableName}`;
            this[variableName] = new variableClass(key, details[variableName], otherVariables);
        }
    }

    _validateVariableName(parentKey, variableName, otherVariableNames) {
        const {requiredProps, optionalProps} = this.constructor;
        if ([...requiredProps, ...optionalProps].includes(variableName))
            return;
        if (RESERVED_NAMES.includes(variableName))
            throw new ConfigError(`${parentKey}: Invalid use of reserved name '${variableName}'`);
        if (otherVariableNames.includes(variableName))
            throw new ConfigError(`${parentKey}: Name '${variableName}' already defined`);
    }
}