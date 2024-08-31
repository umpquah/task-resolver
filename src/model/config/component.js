
import { ConfigError } from "../error.js";

export default class ConfigComponent {
    static requiredProps = [];
    static optionalProps = [];

    constructor(parentKey, details) {
        if (this.constructor == ConfigComponent) {
            throw Error("ConfigComponent is abstract");
        }
        this._validateProps(parentKey, details);
    }

    _validateProps(parentKey, details) {
        const {requiredProps, optionalProps} = this.constructor;
        const allMentionedProps = [...requiredProps, ...optionalProps];
        if (allMentionedProps.length == 0)
            return;
        for (const prop of requiredProps) {
            if (!(prop in details))
                throw new ConfigError(`${parentKey}: Missing required '${prop}' entry`);
        }
        for (const prop in details)
            if (!allMentionedProps.includes(prop))
                throw new ConfigError(`${parentKey}: '${prop}' entry not allowed here`);
    }
};