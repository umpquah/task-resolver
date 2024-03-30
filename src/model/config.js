import { BoolVariable, DerivedVariable, RangeVariable, SelectVariable, StaticVariable } from "./variable.js";
import { ConfigError } from "./error.js";

// map param types to variable classes
const VARTYPE_MAP  = {
    "bool": BoolVariable,
    "range": RangeVariable,
    "select": SelectVariable,
    "static": StaticVariable,
}

// TODO refactoring this:
// - stop storing key as a property, just pass to 
//    _validateProps and _loadDetails()
// 
class ConfigComponent {
    static requiredProps = [];
    static optionalProps = [];

    constructor(key, details) {
        if (this.constructor == ConfigComponent) {
            throw Error("ConfigComponent is abstract");
        }
        this.key = key;
        this._validateProps(details);
    }

    _validateProps(details) {
        // use .constructor because we want the current class's static fields
        const required = this.constructor.requiredProps;
        const optional = this.constructor.optionalProps;
        if (required.length == 0 && optional.length == 0)
            return;
        for (const prop in details)
            if (!required.includes(prop) && !optional.includes(prop))
                throw new ConfigError(`prop '${prop}' is not allowed within ${this.key}`);
        for (const prop of required) {
            if (!(prop in details))
                throw new ConfigError(`${this.key} is missing required prop '${prop}'`);
        }
    }
};

class VariableGroupComponent extends ConfigComponent {
    constructor(key, details, variableClass, varInitArg ) {
        super(key, details);
        this._loadDetails(details, variableClass, varInitArg);
    }

    _loadDetails(details, variableClass, varInitArg) {
        this.variables = {}
        for (const varName in details) {
            try {
                this.variables[varName] = new variableClass(varName, details[varName], varInitArg);
            } catch (e) {
                if (e instanceof ConfigError)
                    throw new ConfigError(`${this.key}.${varName} has invalid spec: ${e.message}`);
                else
                    throw e;
            }
        }
    }
}

class ParamsComponent extends ConfigComponent {
    static optionalProps = ["static", "range", "select", "bool"];

    constructor(key, details) {
        super(`${key}.params`, details);
        this._loadDetails(details);
    }

    _loadDetails(details) {
        this.variables = {}
        for (const varType in details) {
            const key = `${this.key}.${varType}`
            const varClass = VARTYPE_MAP[varType]
            const groupDetails = details[varType];
            const groupComponent = new VariableGroupComponent(key, groupDetails, varClass);
            for (const varName in groupComponent.variables) {
                if (varName in this.variables)
                    throw new ConfigError(`Duplicate identifier '${varName}' in ${key}`);
                this.variables[varName] = groupComponent.variables[varName];
            }
        }
    }
}


class ResultsComponent extends VariableGroupComponent {
    constructor(key, details, priorVariables) {
        super(`${key}.results`, details, DerivedVariable, priorVariables);
    }
}

class ResolutionComponent extends VariableGroupComponent {
    static requiredProps = ["next"];
    static optionalProps = ["announce", "action", "wait"];

    constructor(key, details, priorVariables) {
        super(`${key}.resolution`, details, DerivedVariable, priorVariables);
    }

    _validateProps(details) {
        super._validateProps(details);
        // extra check: "optional" props here are really "at least one of"
        for (let prop of ResolutionComponent.optionalProps)
            if (prop in details)
                return;
        throw new ConfigError(`${this.key} must specify at least one of { announce, action, wait }`);
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
    
    
    const p = new ParamsComponent(
        "stageC",
        {
            static: { count: 11, color: "blue" },
            range: { span: [2, 7] },
            bool: { isFluffy: 0.3 },
            select: { size: [3, 5, 7, 9, 12]}
        }
    )

    const results = new ResultsComponent(
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
    

    console.dir(p.variables);
    console.log();
    console.dir(results.variables);
    console.log();
    console.dir(res.variables);
    console.log();
    console.log(results.variables.a.value);
    console.log(results.variables.b.value);
    console.log();
    console.dir(p);
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
  


