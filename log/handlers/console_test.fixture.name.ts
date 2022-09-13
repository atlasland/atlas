import { Logger } from "../logger.ts";
import { ConsoleHandler } from "./console.ts";

const logger = new Logger("name", {
	handlers: [
		new ConsoleHandler({
			name: true,
		}),
	],
});

logger.debug("this is a debug message");
