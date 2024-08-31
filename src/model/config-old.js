// import { DerivedVariable, variableClassForParameterType } from "./variable/index.js";
// import { ConfigError } from "./error.js";

// const RESERVED_NAMES = [
//     "parameters", "calculations", "resolution",
//     "static", "range", "select", "bool",
//     "announce", "action", "next",
// ];

// export class ConfigComponent {
//     static requiredProps = [];
//     static optionalProps = [];

//     constructor(parentKey, details) {
//         if (this.constructor == ConfigComponent) {
//             throw Error("ConfigComponent is abstract");
//         }
//         this._validateProps(parentKey, details);
//     }

//     _validateProps(parentKey, details) {
//         const {requiredProps, optionalProps} = this.constructor;
//         const allMentionedProps = [...requiredProps, ...optionalProps];
//         if (allMentionedProps.length == 0)
//             return;
//         for (const prop of requiredProps) {
//             if (!(prop in details))
//                 throw new ConfigError(`${parentKey}: Missing required '${prop}' entry`);
//         }
//         for (const prop in details)
//             if (!allMentionedProps.includes(prop))
//                 throw new ConfigError(`${parentKey}: '${prop}' entry not allowed here`);
//     }
// };

// class VariableGroupConfig extends ConfigComponent {
//     constructor(parentKey, details, variableClass, varInitArg ) {
//         super(parentKey, details);
//         for (const variableName in details) {
//             this._validateVariableName(parentKey, variableName);
//             const key = `${parentKey}.${variableName}`;
//             this[variableName] = new variableClass(key, details[variableName], varInitArg);
//         }
//     }

//     _validateVariableName(parentKey, variableName) {
//         const {requiredProps, optionalProps} = this.constructor;
//         if ([...requiredProps, ...optionalProps].includes(variableName))
//             return;
//         if (RESERVED_NAMES.includes(variableName))
//             throw new ConfigError(`${parentKey}: Invalid use of reserved name '${variableName}'`);
//     }
// }

// export class ParametersConfig extends ConfigComponent {
//     static optionalProps = ["static", "range", "select", "bool"];

//     constructor(parentKey, details) {
//         const key = `${parentKey}.params`;
//         super(key, details);
//         this._loadDetails(key, details);
//     }

//     _loadDetails(parentKey, details) {
//         for (const parameterType in details) {
//             const groupConfig = new VariableGroupConfig(
//                 `${parentKey}.${parameterType}`,
//                 details[parameterType],
//                 variableClassForParameterType(parameterType),
//             );
//             for (const variableName in groupConfig) {
//                 if (variableName in this)
//                     throw new ConfigError(`Duplicate use of '${variableName}'`);
//                 this[variableName] = groupConfig[variableName];
//             }
//         }
//     }

//     refresh() {
//         Object.values(this).forEach((paramVariable) => {
//             paramVariable.refresh();
//         })
//     }
// }

// export class CalculationsConfig extends VariableGroupConfig {
//     constructor(parentKey, details, priorVariables) {
//         super(`${parentKey}.calculations`, details, DerivedVariable, priorVariables);
//     }
// }

// export class ResolutionConfig extends VariableGroupConfig {
//     static requiredProps = ["next"];
//     static optionalProps = ["announce", "action", "wait"];

//     constructor(parentKey, details, priorVariables) {
//         super(`${parentKey}.resolution`, details, DerivedVariable, priorVariables);
//     }

//     _validateProps(parentKey, details) {
//         super._validateProps(parentKey, details);
//         const propsPresent = ResolutionConfig.optionalProps.filter((prop) => (prop in details));
//         if (propsPresent.length == 0) {
//             throw new ConfigError(
//                 `${parentKey} must specify at least one: ${ResolutionComponent.optionalProps.join(', ')}`
//             );
//         }
//         if (propsPresent.includes("action") && propsPresent.includes("wait")) {
//             throw new ConfigError(`${parentKey} must have at most one of {action, wait}`);
//         }
//     }
// }


