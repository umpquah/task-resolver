
class ConfigError extends Error {
    constructor(message) {
        super(message);
        this.name = "ConfigError";
    }
}

class Variable {
    constructor(spec) {
        this.spec = spec;
        this.refresh();
    }
    refresh() {
        // no op
    }
}

class StaticVariable extends Variable {
    get value() {
        return this.spec;
    }
}

class RandomVariable extends Variable {
    get value() {
        return this._value;
    }
    refresh() {
        this._value = null;
    }
}

class RangeVariable extends RandomVariable {
    refresh() {
        // TODO: Check spec has valid values
        const [min, max] = this.spec;
        this._value = Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

class BoolVariable extends RandomVariable {
    refresh() {
        // TODO: Check spec has valid value
        const prob = this.spec;
        this._value = (Math.random() < prob);
    }
}

class SelectVariable extends RandomVariable {
    refresh() {
        // TODO: Check spec has valid value
        const options = this.spec;
        const r = Math.floor(Math.random() * options.length);
        this._value = options[r];
    }
}

class DerivedVariable extends Variable {
    constructor(spec, derivedFromVariables) {
        this.spec = spec;
        this._derivedFrom = derivedFromVariables;
        this.refresh();
    }
    refresh() {
        
    }
}

const PARAM_TYPES = {
    "static": StaticVariable,
    "range": RangeVariable,
    "bool": BoolVariable,
    "select": SelectVariable,
}
const STAGE_PROPS = ["initialStage", "label", "params", "result", "actions"];
const ACTION_TYPES = ["report", "next"];

const RESERVED_NAMES = Object.keys(PARAM_TYPES).concat(STAGE_PROPS).concat(ACTION_TYPES);

class Stage {
    constructor({ initialStage, label, params, result, actions }) {
        this.initialStage = initialStage;
        this.label = label;
        this._variables = {};
        this._setup_params(params);
        this._setup_actions(actions);
        this._result = result;
        this.refresh();
    }

    _setup_params(params) {
        for (const type in params) {
            if (!(type in PARAM_TYPES)) {
                throw new ConfigError(`Invalid param type '${type}'`)
            }
        }
        for (const param_type in PARAM_TYPES) {
            const variable_cls = PARAM_TYPES[param_type];
            for (const [name, spec] of Object.entries(params[param_type])) {
                if (RESERVED_NAMES.includes(name)) {
                    throw new ConfigError(`Param names cannot include reserved word '${name}'`);
                }
                this._variables[name] = new variable_cls(spec);
            }
        }
    }

    _setup_actions(actions) {
        this._actions = {};
        for (const type in actions) {
            if (!ACTION_TYPES.includes(type)) {
                throw new ConfigError(`Invalid action type '${type}'`)
            }
        }
    }

    _build_fn(variables, expression) {
        const consts = Object.entries(variables).map(([key, param]) => (
            `const ${key} = ${JSON.stringify(param.value)};`
        )).join("\n")
        const body = `${consts}\n\nreturn ${expression};`;
        return new Function(body);
    }

    refresh() {
        Object.values(this._variables).forEach(p => { p.refresh() });
        this._result_fn = this._build_fn(this._variables, this._result)
    }

    get current_params() {
        let out = {};
        for (const param_name in this._params) {
            out[param_name] = this._params[param_name].value;
        }
        return out;
    }
    
    get result() {
        return this._result_fn();
    }
}


const stages = {
    stageA: {
        initialStage: true, // Error if set for more than one
        label: "Stage A",
        params: {
            static: {
                baseAmount: 3,
                units: ["step", "steps"],
                directions: ["left", "right"],
            },
            range: {
                dist: [1, 11],
            },
            select: {
                color: ["red", "blue", "green", "purple"],
            },
            bool: {
                goRight: 0.8,
            },
        },
        result: "baseAmount * dist",
        actions: {
            report: "`Go ${result} ${color} steps ${goRight ? 'right' : 'left'}`",
            next: "goRight ? 'stageB' : 'stageC'",
        }
    },
    stageB: {
        label: "Stage B",
    },
    stageC: {
        label: "Stage C",
    }
};

const stage = new Stage(stages.stageA)

for (let i = 0; i < 10; i++) {
    // console.dir(stage.current_params);
    console.log(stage.result);
    // console.log();
    stage.refresh();
}