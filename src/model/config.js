import { BoolVariable, DerivedVariable, RangeVariable, SelectVariable, StaticVariable } from "./variable.js";
import { ConfigError } from "./error.js";

const VARIABLE_TYPE_MAP  = {
    "bool": BoolVariable,
    "range": RangeVariable,
    "select": SelectVariable,
    "static": StaticVariable,
}


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
                throw new ConfigError(`prop '${prop}' is not allowed within ${key}`);
        for (const prop of required) {
            if (!(prop in details))
                throw new ConfigError(`${parentKey} is missing required prop '${prop}'`);
        }
    }
};

class VariableGroupComponent extends ConfigComponent {
    constructor(parentKey, details, variableClass, varInitArg ) {
        super(parentKey, details);
        this._loadDetails(parentKey, details, variableClass, varInitArg);
    }

    _loadDetails(parentKey, details, variableClass, varInitArg) {
        this.variables = {}
        for (const variableName in details) {
            const key = `${parentKey}.${variableName}`;
            this.variables[variableName] = new variableClass(key, details[variableName], varInitArg);
        }
    }
}

class ParametersComponent extends ConfigComponent {
    static optionalProps = ["static", "range", "select", "bool"];

    constructor(parentKey, details) {
        const key = `${parentKey}.params`;
        super(key, details);
        this.variables = {};
        this._loadDetails(key, details);
    }

    _loadDetails(key, details) {
        for (const variableType in details) {
            const groupComponent = new VariableGroupComponent(
                `${key}.${variableType}`,
                details[variableType],
                VARIABLE_TYPE_MAP[variableType],
            );
            for (const variableName in groupComponent.variables) {
                this.variables[variableName] = groupComponent.variables[variableName];
            }
        }
    }
}

class CalculationsComponent extends VariableGroupComponent {
    constructor(key, details, priorVariables) {
        super(`${key}.calculations`, details, DerivedVariable, priorVariables);
    }
}

class ResolutionComponent extends VariableGroupComponent {
    static requiredProps = ["next"];
    static optionalProps = ["announce", "action", "wait"];

    constructor(key, details, priorVariables) {
        super(`${key}.resolution`, details, DerivedVariable, priorVariables);
    }

    _validateProps(key, details) {
        super._validateProps(key, details);
        // extra check: "optional" props here are really "at least one of"
        for (let prop of ResolutionComponent.optionalProps)
            if (prop in details)
                return;
        throw new ConfigError(
            `${key} must specify at least one: ${ResolutionComponent.optionalProps.join(', ')}`);
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

function test() {
    // const s = new StageComponent(
    //     "stageA",
    //     {
    //         initialStage: true, // Error if set for more than one
    //         label: "Stage A",
    //         params: "paramstuff",
    //         results: "....",
    //         resolution: "resolution",
    //     }
    // );
    
    
    const p = new ParametersComponent(
        "stageC",
        {
            static: { count: 11, color: "blue" },
            range: { span: [2, 7], span: [1, 3] },
            bool: { isFluffy: 0.3 },
            select: { size: [3, 5, 7, 9, 12]}
        }
    )

    const calc = new CalculationsComponent(
        "stageQ",
        {
            a: "6 * 7",
            b: "'cake!'",
        },
        []
    );

    const res = new ResolutionComponent(
        "stageZ",
        {
            announce: "Hi",
            next: "bar",
        },
        []
    );
    

    console.dir(p);
    console.log();
    console.dir(calc);
    console.log();
    console.dir(res);
    console.log();
}

try {
    test();
} catch (e) {
    if (e instanceof ConfigError) {
        console.log("Configuration failed.");
        console.log(e.message);
    }
    else
        throw e;
}
  


