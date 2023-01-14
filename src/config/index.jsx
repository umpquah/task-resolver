import { DEFAULT_CONFIG } from "./default";

class ConfigError extends Error {
    constructor(message) {
        super(message);
        this.name = "ConfigError";
    }
}

const HELPERS = {
    randomInt: (min, max) => (Math.floor(Math.random() * (max - min + 1)) + min),
    randomChoice: (options) => {
        const r = Math.floor(Math.random() * options.length);
        return options[r];
    },
    format: (value, units) => {
      let lastLetter = units.charAt(units.length - 1);
      let ustr = (value == 1 && lastLetter == "s") 
        ? units.substring(0, units.length - 1)
        : units;
      return `${value} ${ustr}`;
    },
};

class Config {
    constructor(data) {
        this.data = data;
        this.functions = {};
        for (const [name, expression] of Object.entries(this.data.values)) {
            this._buildFunction(name, expression);
        }
    }

    evaluate(valueName) {
        const { settings, values } = this.data;
        const fn = this.functions[valueName];
        if (!fn) {
            throw new ConfigError(`Invalid expression name '${valueName}'`);
        }
        try {
            return fn.call(this, settings, HELPERS);
        } catch (e) {
            throw new ConfigError(`Invalid expression '${values[valueName]}': ${e.message}`);
        }
    }

    _buildFunction(name, expression) {
        /* eslint-disable no-new-func */
        const fn = new Function(
            "settings",
            "helpers",
            (
                `const { ${Object.keys(this.data.settings).join(", ")} } = settings;` +
                `const { ${Object.keys(HELPERS).join(", ")} } = helpers;` +
                `return ${expression};`
            )
        );
        this.functions[name] = fn;
        this.evaluate(name);  // To trigger exception early if invalid
    }
}

export default Config;
export { DEFAULT_CONFIG };

