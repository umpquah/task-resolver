import { ConfigError } from "./error.js";

export class AbstractVariable {
    constructor(name, spec) {
        if (this.constructor == AbstractVariable) {
            throw Error("AbstractVariable cannot be instantiated")
        }
        this.name = name;
        this.loadSpec(spec);
        this.refresh();
    }
    refresh() {
        // no op
    }
}

export class StaticVariable extends AbstractVariable {
    loadSpec(spec) {
        this.value = spec
    }
}

export class RangeVariable extends AbstractVariable {
    refresh() {
        this.value = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
    }
    loadSpec(spec) {
        if (!Array.isArray(spec) || spec.length != 2) 
            throw new ConfigError("must be two-element array");
        const [min, max] = spec; 
        if (!(Number.isInteger(max) && Number.isInteger(max)))
            throw new ConfigError("values must be integers");
        if (min > max)
            throw new ConfigError("1st value cannot be larger than 2nd value");
        this.min = min;
        this.max = max;
    }
}

export class BoolVariable extends AbstractVariable {
    refresh() {
        this.value = (Math.random() < this.probability);
    }
    loadSpec(spec) {
        if (typeof spec != "number")
            throw new ConfigError("must be a number");
        if (spec < 0 || spec > 1) 
            throw new ConfigError("must be between 0 and 1");
        this.prob = spec;
    }
}

export class SelectVariable extends AbstractVariable {
    refresh() {
        const r = Math.floor(Math.random() * this.options.length);
        this.value = this.options[r];
    }
    loadSpec(spec) {
        if (!Array.isArray(spec) || spec.length == 0)
            throw new ConfigError("must be an array with >=1 items");
        this.options = spec;
    }
}

export class DerivedVariable extends AbstractVariable {
    constructor(name, spec, derivedFrom) {
        super(name, spec);
        this._derivedFrom = derivedFrom;
        const names = derivedFrom.map((v) => v.name);
        this._fn = new Function(...names, "return " + spec + ";");
    }

    get value() {
        const values = this._derivedFrom.map((v) => v.value);
        return this._fn(...values);
    }
}

