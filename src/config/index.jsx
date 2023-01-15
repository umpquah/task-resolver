class ConfigError extends Error {
    constructor(message) {
        super(message);
        this.name = "ConfigError";
    }
}

const HELPERS = {
    randomInt: (min, max) => (Math.floor(Math.random() * (max - min + 1)) + min),
    randomBool: (probability) => (Math.random() > probability),
    randomChoice: (options) => {
        const r = Math.floor(Math.random() * options.length);
        return options[r];
    }
};

const _buildFunction = (name, expression, settings) => {
  /* eslint-disable no-new-func */
  const fn = new Function(
      "settings",
      "helpers",
      (
          `const { ${Object.keys(settings).join(", ")} } = settings;` +
          `const { ${Object.keys(HELPERS).join(", ")} } = helpers;` +
          `return ${expression};`
      )
  );
  // Try to trigger an early exception if syntax is bad
  try {
    fn(settings, HELPERS)
  } catch (e) {
    throw new ConfigError(`Invalid expression for ${name}.result: ${e.message}`);
  } 
};

class Config {
    constructor(data) {
        this.stages = data.stages;
        this.transitions = data.transitions;
        console.log("HERE");
        Object.entries(this.stages).forEach(([name, stage]) => {
          console.dir(stage.result);
          console.dir(stage.settings);
          
          const resultFn = _buildFunction(name, stage.result, stage.settings)
        });
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
}

export default Config;

export * from "./default";
export * from "./constants";

