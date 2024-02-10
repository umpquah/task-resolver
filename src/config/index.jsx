import { FUNCTION_LIBRARY } from "./functions";
import { ConfigError } from "./error";

class Config {
    constructor(dataJson) {
        this.json = dataJson;
        let data;
        try {
          data = JSON.parse(dataJson);
        } catch (e) {
          const msg = e.message.replace("JSON.parse:", "");
          throw new ConfigError(`Invalid JSON: ${msg}`);
        }
        Object.assign(this, data); 
        Object.entries(this.stages).forEach(([key, stage]) => {
          const { settings } = stage;
          ["result", "formatResult", "next"].forEach((prop) => {
            stage[prop] = _function(`${key}.${prop}`, stage[prop], settings)
          })
        });
    }
}

const _function = (name, expression, settings) => {
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
      return (r) => fn(settings, FUNCTION_LIBRARY)(r);
    else
      return () => fn(settings, FUNCTION_LIBRARY);
  } catch (e) {
    throw new ConfigError(`Invalid expression for stages.${name}: ${e.message}`);
  }
};

export default Config;
export * from "./defaults";
export * from "./error";


