import { Logger } from "../logger.ts";
import { ConsoleHandler } from "./console.ts";

const logger = new Logger("color", {
	handlers: [
		new ConsoleHandler(),
	],
});

logger.debug("hello");
