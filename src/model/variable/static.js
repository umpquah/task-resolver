import { AbstractVariable } from "./base.js";

export default class StaticVariable extends AbstractVariable {
    loadSpec(spec) {
        this.value = spec
    }
}
