import { Logger } from "../logger.ts";
import { ConsoleHandler } from "./console.ts";

const logger = new Logger("timestamp", {
	handlers: [
		new ConsoleHandler({
			timestamp: true,
		}),
	],
});

logger.debug("this is a debug message");
