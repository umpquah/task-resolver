
class ConfigError extends Error {
    constructor(message) {
        super(message);
        this.name = "ConfigError";
    }
}

class AbstractVariable {
    constructor(name, spec) {
        if(this.constructor == AbstractVariable) {
            throw new Error("AbstractVariable cannot be instantiated");
        };
        this.name = name;
        this.spec = spec;
        this.refresh(); // run initial randomization as needed
    }

    refresh() {
        // no op
    }

    get value() {
        return this._value;
    }
}

class StaticVariable extends AbstractVariable {
    constructor(name, spec) {
        super(name, spec);
     
        this._value = spec;
    }

}

class RangeVariable extends AbstractVariable {
    refresh() {
        // TODO: Check spec has valid values
        const [min, max] = this.spec;
        this._value = Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

class BoolVariable extends AbstractVariable {
    refresh() {
        // TODO: Check spec has valid value
        const prob = this.spec;
        this._value = (Math.random() < prob);
    }
}

class SelectVariable extends AbstractVariable {
    refresh() {
        // TODO: Check spec has valid value
        const options = this.spec;
        const r = Math.floor(Math.random() * options.length);
        this._value = options[r];
    }
}

class DerivedVariable extends AbstractVariable {
    constructor(name, spec, derivedFromVariables) {
        super(name, spec);
        const variableNames = derivedFromVariables.map((v) => (v.name));
        const fnBody = `return ${spec};`;
        const fn = new Function(...variableNames, fnBody);
        this.value = fn();
    }

    refresh() {
        // N/A
    }
}

const PARAM_TYPES = {
    "static": StaticVariable,
    "range": RangeVariable,
    "bool": BoolVariable,
    "select": SelectVariable,
}
const STAGE_PROPS = ["initialStage", "label", "parameters", "results", "resolution"];
const RESOLUTION_PROPS = ["announce", "action", "wait", "next"];
const RESERVED_NAMES = Object.keys(PARAM_TYPES).concat(STAGE_PROPS).concat(RESOLUTION_PROPS);

class Stage {
    constructor({ initialStage, label, params, results, resolution }) {
        this.initialStage = initialStage;
        this.label = label;
        this._variables = {};
        this._setup_params(params);
        // this._setup_actions(actions);
        // this._result = result;
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
                this._variables[name] = new variable_cls(name, spec);
            }
        }
    }

    // _setup_actions(actions) {
    //     this._actions = {};
    //     for (const type in actions) {
    //         if (!ACTION_TYPES.includes(type)) {
    //             throw new ConfigError(`Invalid action type '${type}'`)
    //         }
    //     }
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
        parameters: {
            static: {
                baseAmount: 3,
                units: ["step", "steps"],
                directions: ["left", "right"],
            },
            range: {
                steps: [1, 11],
            },
            select: {
                color: ["red", "blue", "green", "purple"],
            },
            bool: {
                goRight: 0.8,
            },
        },
        results: {
            distance: "baseAmount * steps",
        },
        resolution: {
            report: "`Go ${distance} ${color} steps ${goRight ? 'right' : 'left'}`",
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

// const v = new AbstractVariable("age", "blah");
let dozens = new RangeVariable("dozens", [2, 7]);
let base = new StaticVariable("base", 12);

let eggs = new DerivedVariable("eggs", "base * dozens", [dozens, base])

for (let i = 0; i < 10; i++) {
    console.log(`${dozens.value} ${base.value} --> ${eggs.value}`);
    dozens.refresh();
    base.refresh();
}
