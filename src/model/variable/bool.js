import { AbstractVariable } from "./base.js";

export default class BoolVariable extends AbstractVariable {
    loadSpec(spec) {
        this.probability = spec;
    }

    validateSpec(spec) {
        if (typeof spec != "number")
            this.throwConfigError("must be a number");
        if (spec < 0 || spec > 1) 
            this.throwConfigError("must be between 0 and 1");
    }

    reset() {
        this.value = (Math.random() < this.probability);
    }
}
