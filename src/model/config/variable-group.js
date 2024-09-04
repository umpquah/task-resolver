import ConfigComponent from "./component.js";

const RESERVED_NAMES = [
    "parameters", "calculations", "resolution",
    "static", "range", "select", "bool",
    "announce", "action", "next",
];


export default class VariableGroupConfig extends ConfigComponent {
    constructor(parentKey, details, variableClass, variableInitArg ) {
        super(parentKey, details);
        for (const variableName in details) {
            this._validateVariableName(parentKey, variableName);
            const key = `${parentKey}.${variableName}`;
            this[variableName] = new variableClass(key, details[variableName], variableInitArg);
        }
    }

    _validateVariableName(parentKey, variableName) {
        const {requiredProps, optionalProps} = this.constructor;
        if ([...requiredProps, ...optionalProps].includes(variableName))
            return;
        if (RESERVED_NAMES.includes(variableName))
            throw new ConfigError(`${parentKey}: Invalid use of reserved name '${variableName}'`);
    }
}