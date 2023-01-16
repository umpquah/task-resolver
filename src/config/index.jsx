import { FUNCTION_LIBRARY } from "./functions";
import { ConfigError } from "./error";

class Config {
    constructor(dataJson) {
        this.json = dataJson;
        const data = JSON.parse(dataJson);
        Object.assign(this, data); // Link all data.__ to the this object directly
        Object.entries(this.stages).forEach(([key, stage]) => {
          const { settings, result, formatResult, next } = stage;
          stage.result = _function(`${key}.result`, result, settings);
          stage.formatResult = _function(`${key}.formatResult`, formatResult, settings);
          stage.next = _function(`${key}.next`, next, settings);
        });
    }
}

const _function = (name, expression, settings, helpers) => {
  /* eslint-disable no-new-func */
  const fn = new Function(
      "settings",
      "lib",
      (
          `const { ${Object.keys(settings).join(", ")} } = settings;` +
          `const { ${Object.keys(FUNCTION_LIBRARY).join(", ")} } = lib;` +
          `return ${expression};`
      )
  );
  try {
    const fnCalled = fn(settings, FUNCTION_LIBRARY);
    if (fnCalled instanceof Function)
      // second-order function
      return (r) => fn(settings, FUNCTION_LIBRARY)(r);
    else
      return () => fn(settings, FUNCTION_LIBRARY);
  } catch (e) {
    throw new ConfigError(`Invalid expression for stages.${name}: ${e.message}`);
  }
};

export default Config;
export * from "./default";
export * from "./error";


