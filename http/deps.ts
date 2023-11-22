export { type ConnInfo, Status, STATUS_TEXT } from "https://deno.land/std@0.207.0/http/mod.ts";
export { serveFile } from "https://deno.land/std@0.207.0/http/file_server.ts";
export { walk, type WalkOptions } from "https://deno.land/std@0.207.0/fs/mod.ts";
export { extname, toFileUrl } from "https://deno.land/std@0.207.0/path/mod.ts";

import { ConsoleHandler, Logger } from "../log/mod.ts";
export const logger = new Logger("atlas/http", {
	handlers: [
		new ConsoleHandler(),
	],
});
