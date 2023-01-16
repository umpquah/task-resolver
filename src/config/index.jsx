import { HELPER_FUNCTIONS } from "./functions";
import { ConfigError } from "./error";

class Config {
    constructor(dataJson) {
        this.json = dataJson;
        const data = JSON.parse(dataJson);
        Object.assign(this, data);
        Object.entries(this.stages).forEach(([name, stage]) => {
          const { settings, result, formatResult, next } = stage;
          const resultFn = _buildFunction(`${name}.result`, result, settings)
          stage.result = () => resultFn(settings, HELPER_FUNCTIONS, null);
          const formatResultFn = _buildFunction(`${name}.formatResult`, formatResult, settings);
          stage.formatResult = (result) => formatResultFn(settings, HELPER_FUNCTIONS, result);
          const nextFn = _buildFunction(`${name}.next`, next, settings);
          stage.next = (result) => nextFn(settings, HELPER_FUNCTIONS, result);
        });
    }
}

const _buildFunction = (name, expression, settings) => {
  /* eslint-disable no-new-func */
  const fn = new Function(
      "settings",
      "utilFns",
      "result",
      (
          `const { ${Object.keys(settings).join(", ")} } = settings;` +
          `const { ${Object.keys(HELPER_FUNCTIONS).join(", ")} } = utilFns;` +
          `return ${expression};`
      )
  );
  // Try to trigger an early exception in case syntax is bad
  try {
    fn(settings, HELPER_FUNCTIONS);
  } catch (e) {
    throw new ConfigError(`Invalid expression for ${name}: ${e.message}`);
  }
  return fn;
};

export default Config;
export * from "./default";
export * from "./error";


