import VariableGroupConfig from "./variable-group.js";
import DerivedVariable from "../variable/derived.js";

export default class CalculationsConfig extends VariableGroupConfig {
    constructor(parentKey, details, priorVariables) {
        super(`${parentKey}.calculations`, details, DerivedVariable, priorVariables);
    }
}
