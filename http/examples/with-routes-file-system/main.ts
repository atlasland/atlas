import { logger } from "../../deps.ts";
import { start } from "../../mod.ts";

await start({
	onListen({ hostname, port }) {
		const host = hostname === "0.0.0.0" ? "localhost" : hostname;
		logger.info(`listening on http://${host}:${port}`);
	},
	onError(error) {
		logger.error(error);
	},
});
