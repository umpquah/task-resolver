import { AbstractVariable } from "./base.js";

export default class SelectVariable extends AbstractVariable {
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
