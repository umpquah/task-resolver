import { StaticVariable } from "../config/variable";

const BUILTIN_FUNCTIONS = [
    new StaticVariable("formatWithUnits", (amount, singularUnit, pluralUnit) => (
        `${amount} ${amount === 1 ? singularUnit : pluralUnit}`
    )),
];

export default BUILTIN_FUNCTIONS;


