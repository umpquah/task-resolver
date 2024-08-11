import { ConfigComponent, ParametersConfig, CalculationsConfig, ResolutionConfig } from "./config.js";
import builtInFunctions from "./builtins.js";
import { buildQueries } from "@testing-library/react";

export default class Stage extends ConfigComponent {
    static requiredProps = ["label", "parameters", "calculations", "resolution"];
    static optionalProps = ["initialStage"];

    constructor(parentKey, details) {
        super(parentKey, details);
        this._loadDetails(parentKey, details);
    }

    _loadDetails(parentKey, details) {
        this.label = details.label;
        this.initialStage = details.initialStage;
        this.parameters = new ParametersConfig(
            parentKey,
            details.parameters
        );
        this.calculations = new CalculationsConfig(
            parentKey,
            details.calculations,
            Object.values(this.parameters).concat(builtInFunctions())
        );
        this.resolution = new ResolutionConfig(
            parentKey,
            details.resolution,
            Object.values(this.parameters).concat(Object.values(this.calculations))
        );
    }

    show() {
        ["parameters", "calculations", "resolution"].forEach((confType) => {
            console.log(`${confType[0].toUpperCase()}${confType.slice(1)}`);
            Object.keys(this[confType]).forEach((key) => {
                console.log(`  ${key}: ${this[confType][key].value}`);
            });
        })
    }

    refresh() {
        this.parameters.refresh();
    }
}
