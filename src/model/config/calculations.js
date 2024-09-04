import VariableGroupConfig from "./variable-group.js";
import DerivedVariable from "../variable/derived.js";

export default class CalculationsConfig extends VariableGroupConfig {
    constructor(parentKey, details, variables) {
        super(`${parentKey}.calculations`, details, DerivedVariable, variables);
    }
}
