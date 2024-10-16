import VariableGroupConfig from "./variable-group.js";
import { DerivedVariable } from "./variable";
import { ConfigError } from "../util/error.js";

export default class ResolutionConfig extends VariableGroupConfig {
    static requiredProps = ["next"];
    static optionalProps = ["announce", "action", "wait"];

    constructor(parentKey, details, otherVariables) {
        super(`${parentKey}.resolution`, details, DerivedVariable, otherVariables);
    }

    _validateProps(parentKey, details) {
        super._validateProps(parentKey, details);
        const propsPresent = ResolutionConfig.optionalProps.filter((prop) => (prop in details));
        if (propsPresent.length === 0) {
            throw new ConfigError(
                `${parentKey} must specify at least one: ${ResolutionConfig.optionalProps.join(', ')}`
            );
        }
        if (propsPresent.includes("action") && propsPresent.includes("wait")) {
            throw new ConfigError(`${parentKey} must have at most one of {action, wait}`);
        }
    }
}
