import { ConfigError } from "./error.js";

export class AbstractVariable {
    constructor(key, spec) {
        if (this.constructor == AbstractVariable) {
            throw Error("AbstractVariable cannot be instantiated")
        }
        this.key = key;
        this.validateSpec(spec);
        this.loadSpec(spec);
        this.refresh();
    }

    validateSpec() {}
    loadSpec() {}
    refresh() {}
    
    throwConfigError(msg) {
        throw new ConfigError(`${this.key}: ${msg}`)
    }
}

export class StaticVariable extends AbstractVariable {
    loadSpec(spec) {
        this.value = spec
    }
}

export class RangeVariable extends AbstractVariable {
    loadSpec([min, max]) {
        this.min = min;
        this.max = max;
    }

    validateSpec(spec) {
        if (!Array.isArray(spec) || spec.length != 2) 
            this.throwConfigError("must be two-element array");
        const [min, max] = spec; 
        if (!(Number.isInteger(max) && Number.isInteger(max)))
            this.throwConfigError("values must be integers");
        if (min > max)
            this.throwConfigError("1st value cannot be larger than 2nd value");
    }

    refresh() {
        this.value = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
    }
}

export class BoolVariable extends AbstractVariable {
    loadSpec(spec) {
        this.probability = spec;
    }

    validateSpec(spec) {
        if (typeof spec != "number")
            this.throwConfigError("must be a number");
        if (spec < 0 || spec > 1) 
            this.throwConfigError("must be between 0 and 1");
    }

    refresh() {
        this.value = (Math.random() < this.probability);
    }
}

export class SelectVariable extends AbstractVariable {
    loadSpec(spec) {
        this.options = spec;
    }

    validateSpec(spec) {
        if (!Array.isArray(spec) || spec.length == 0)
            this.throwConfigError("must be an array with >=1 items");
    }

    refresh() {
        const r = Math.floor(Math.random() * this.options.length);
        this.value = this.options[r];
    }
}

export class DerivedVariable extends AbstractVariable {
    constructor(key, spec, derivedFrom) {
        super(key, spec);
        this._derivedFrom = derivedFrom;
        const names = derivedFrom.map((v) => v.name);
        this._fn = new Function(...names, "return " + spec + ";");
    }

    get value() {
        const values = this._derivedFrom.map((v) => v.value);
        return this._fn(...values);
    }
}

