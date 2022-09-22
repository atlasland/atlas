import { Logger } from "../logger.ts";
import { ConsoleHandler } from "./console.ts";

const logger = new Logger("json", {
	handlers: [
		new ConsoleHandler({
			json: true,
		}),
	],
});

logger.debug("hello", "there");
