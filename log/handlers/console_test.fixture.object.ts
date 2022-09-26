import { Logger } from "../logger.ts";
import { ConsoleHandler } from "./console.ts";

const logger = new Logger("object", {
	handlers: [
		new ConsoleHandler({
			color: false,
		}),
	],
});

logger.debug({ key: "value" });
