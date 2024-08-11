import { StaticVariable } from "./variable.js"

const BUILTIN_FUNCTIONS = {
    formatWithUnits: (amount, singularUnit, pluralUnit) => {
        return `${amount} ${amount === 1 ? singularUnit : pluralUnit}`;
    },
    square: (x) => x * x,
};

export default function builtInFunctions() {
    return Object.keys(BUILTIN_FUNCTIONS).map((name) => (
        new StaticVariable(name, BUILTIN_FUNCTIONS[name])
    ));
}

