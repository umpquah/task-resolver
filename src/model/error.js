export class ConfigError extends Error {
    constructor(message) {
        super(message);
        this.name = "ConfigError";
    }
}

export class StageError extends Error {
    constructor(message) {
        super(message);
        this.name = "StageError";
    }
}
