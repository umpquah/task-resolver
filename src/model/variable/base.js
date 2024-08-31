import { ConfigError } from "../error.js";

export class AbstractVariable {
    constructor(key, spec) {
        if (this.constructor == AbstractVariable) {
            throw Error("AbstractVariable cannot be instantiated")
        }
        this.key = key;
        this.name = key.split(".").slice(-1)[0];
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
};