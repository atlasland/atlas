import { logger, serve, Status } from "./deps.ts";
import { type Handler, Router } from "./router.ts";

export class Server {
	#router: Router;

	constructor(router: Router) {
		this.#router = router;
	}

	get router() {
		return this.#router;
	}

	/** Starts an http server instance */
	async serve() {
		const controller = new AbortController();

		try {
			await serve(this.#router.handler.bind(this.#router), {
				signal: controller.signal,
				onListen: ({ hostname, port }) => {
					const host = hostname === "0.0.0.0" ? "localhost" : hostname;
					logger.info(`Listening on http://${host}:${port}`);
				},
				onError: this.#router.errorHandler.bind(this.#router),
			});
		} catch (error) {
			logger.error(error);
			controller.abort();
		}
	}
}

/** Starts an http server instance */
export async function start(): Promise<void>;
export async function start(handler: Handler): Promise<void>;
export async function start(router: Router): Promise<void>;
export async function start(init?: unknown): Promise<void> {
	let router: Router;

	// router provided
	if (init instanceof Router) {
		router = init;
	} // handler fn provided
	else if (typeof init === "function") {
		router = new Router().any("*", init as Handler);
	} // no routes, try file system
	else if (init === undefined) {
		logger.debug("no routes, try file system");
		// TODO(gabrielizaias): implement file-system routing
		router = new Router().any("*", () => {
			throw Status.NotImplemented;
		});
	} else {
		throw new Error("Invalid init parameter passed for `start()`");
	}

	await new Server(router).serve();
}
