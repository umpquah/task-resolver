import { AbstractVariable } from "./base.js";

export default class DerivedVariable extends AbstractVariable {
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
