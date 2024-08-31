import BoolVariable from './bool.js';
import DerivedVariable from './derived.js';
import RangeVariable from './range.js';
import SelectVariable from './select.js';
import StaticVariable from './static.js';

const PARAMETER_TYPE_MAP  = {
    "bool": BoolVariable,
    "range": RangeVariable,
    "select": SelectVariable,
    "static": StaticVariable,
}

const variableClassForParameterType = (paramType) => {
    return PARAMETER_TYPE_MAP[paramType];
}

export { BoolVariable, DerivedVariable, RangeVariable, SelectVariable, StaticVariable, variableClassForParameterType };

