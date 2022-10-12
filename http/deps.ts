export {
	type ConnInfo,
	serve,
	Status,
	STATUS_TEXT,
} from "https://deno.land/std@0.159.0/http/mod.ts";
export { extname } from "https://deno.land/std@0.159.0/path/mod.ts";

import { ConsoleHandler, Logger } from "../log/mod.ts";
export const logger = new Logger("http", {
	handlers: [
		new ConsoleHandler(),
	],
});
