import { AbstractVariable } from "./base.js";

export default class RangeVariable extends AbstractVariable {
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
