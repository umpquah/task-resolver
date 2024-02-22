
class ConfigError extends Error {
    constructor(message) {
        super(message);
        this.name = "ConfigError";
    }
}

class AbstractVariable {
    constructor(name, spec) {
        if (this.constructor == AbstractVariable) {
            throw Error("AbstractVariable cannot be instantiated ")
        }
        this.name = name;
        this.spec = spec;
        this.refresh();
    }
    refresh() {
        // no op
    }
}

class StaticVariable extends AbstractVariable {
    constructor(name, spec) {
        super(name, spec);
        this.value = spec;
    }
}

class RangeVariable extends AbstractVariable {
    refresh() {
        // TODO: Check spec has valid values
        const [min, max] = this.spec;
        this.value = Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

class BoolVariable extends AbstractVariable {
    refresh() {
        // TODO: Check spec has valid value
        const prob = this.spec;
        this.value = (Math.random() < prob);
    }
}

class SelectVariable extends AbstractVariable {
    refresh() {
        // TODO: Check spec has valid value
        const options = this.spec;
        const r = Math.floor(Math.random() * options.length);
        this.value = options[r];
    }
}

// TODO: Build out this class, use if for result and actions
class DerivedVariable extends AbstractVariable {
    constructor(name, spec, derivedFrom) {
        super(name, spec);
        this._derivedFrom = derivedFrom;
        const names = derivedFrom.map((v) => v.name);
        this._fn = new Function(...names, "return " + spec + ";");
        console.log(this._fn);
    }

    get value() {
        const values = this._derivedFrom.map((v) => v.value);
        return this._fn(...values);
    }

    _build_fn(variables, expression) {
        const consts = Object.entries(variables).map(([key, param]) => (
            `const ${key} = ${JSON.stringify(param.value)};`
        )).join("\n")
        const body = `${consts}\n\nreturn ${expression};`;
        return new Function(body);
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

    // _build_fn(variables, expression) {
    //     const consts = Object.entries(variables).map(([key, param]) => (
    //         `const ${key} = ${JSON.stringify(param.value)};`
    //     )).join("\n")
    //     const body = `${consts}\n\nreturn ${expression};`;
    //     return new Function(body);
    // }

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

// const stage = new Stage(stages.stageA)

// for (let i = 0; i < 10; i++) {
//     // console.dir(stage.current_params);
//     console.log(stage.result);
//     // console.log();
//     stage.refresh();
// }

// const v = new RangeVariable("v", [3, 8]);

// for (let i = 0; i < 10; i++) {
//     console.log(v.value);
//     v.refresh();
// }

const dozen = new StaticVariable("dozen", 12);
const count = new RangeVariable("count", [1, 10]);

const result = new DerivedVariable("result", "dozen * count", [dozen, count]);
for (let i = 0; i < 10; i++) {
    dozen.refresh();
    count.refresh();
    console.log(result.value);
}