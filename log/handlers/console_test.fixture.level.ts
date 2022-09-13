import { LogLevel } from "../level.ts";
import { Logger } from "../logger.ts";
import { ConsoleHandler } from "./console.ts";

const logger = new Logger("level", {
	handlers: [
		new ConsoleHandler(),
	],
});

Object.values(LogLevel).forEach((level) => {
	logger[level]?.(`a message with '${level}' level`);
});
