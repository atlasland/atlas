import {
	type ConnInfo,
	extname,
	logger,
	Status,
	STATUS_TEXT,
	toFileUrl,
	walk,
	type WalkOptions,
} from "./deps.ts";

export const METHODS = {
	GET: "GET",
	POST: "POST",
	PUT: "PUT",
	PATCH: "PATCH",
	DELETE: "DELETE",
	OPTIONS: "OPTIONS",
	ANY: "ANY",
} as const;

/**
 * Supported HTTP methods.
 *
 * `ANY` is the wildcard value for any request method.
 */
export type Method = keyof typeof METHODS;

/** An `URLPattern` string to match against a `Request.pathname` */
export type Pattern = `/${string}` | "*";

export type RouteKey = `${Method} ${Pattern}`;
export type RouteMap = Map<RouteKey, Handler>;
export type HandlerMap = Map<Method, Handler>;

/** A handler function for an incoming Request */
export type Handler<P extends Params = Record<string, string | undefined>> = (
	request: Request,
	context: Context<P>,
) =>
	| Response
	| Promise<Response>
	| Record<string, unknown>
	| Promise<Record<string, unknown>>;

/** A handler function that handles thrown errors */
export type ErrorHandler<P extends Params = Record<string, string | undefined>> = (
	error: unknown,
	request?: Request,
	context?: Context<P>,
) => Response | Promise<Response>;

/** The Request context */
export type Context<P extends Params = Record<string, string | undefined>> =
	& Partial<ConnInfo>
	& {
		/** The path parameters found in the URL pathname */
		params: P;
	};

/** The middleware Request context */
export type MiddlewareContext = Context & {
	/** Calls the next handler function for the Request */
	next?: () => Promise<void>;
};

/** The path parameters found in the URL pathname */
export type Params = Record<string, string | undefined>;

export class Router {
	#routes: RouteMap;

	constructor() {
		this.#routes = new Map();
	}

	get routes() {
		return this.#routes;
	}

	/** Handles an incoming request */
	async handler(
		request: Request,
		conection?: ConnInfo,
	) {
		const { method } = request;
		const { pathname, search } = new URL(request.url);

		// TODO(gabrielizaias): handle request for assets

		const [pattern, handler] = getRouteMatch(request, this.#routes);
		const params = toParams(pathname, pattern);
		const context = { ...conection, params };

		let status = Status.OK;
		let headers = new Headers();
		let body: BodyInit | null = null;

		try {
			const result = await handler(request, context);

			if (result instanceof Response) {
				status = result.status;
				body = result.body;
				headers = new Headers(result.headers);
			} else {
				try {
					body = JSON.stringify(result);
					headers.set("content-type", "application/json");
				} catch (_error) {
					// do nothing?
				}
			}
		} catch (error) {
			const result = await this.errorHandler(error, request, context);
			status = result.status;
			body = result.body;
			headers = new Headers(result.headers);
		}

		const response = new Response(body, {
			headers,
			status,
			statusText: STATUS_TEXT[status],
		});

		logger.info(status, `${method} ${pathname}${search}`);

		return response;
	}

	/** The default error handler */
	// deno-lint-ignore require-await
	async errorHandler(error: unknown, _request?: Request, _context?: Context) {
		let status = Status.InternalServerError;
		let body = `${STATUS_TEXT[status]}`;
		const headers = new Headers();

		// handle shorthand `throw 404` or `throw Status.NotFound`
		if (typeof error === "number") {
			status = error;
			headers.set("content-type", "text/plain; charset=UTF-8");
			body = `${status} ${STATUS_TEXT[status]}`;
		} else {
			logger.error(error);
		}

		return new Response(body, {
			status,
			statusText: STATUS_TEXT[status],
			headers,
		});
	}

	/** Registers a Request handler for a given method and pattern */
	register(method: Method, pattern: Pattern, handler: Handler) {
		const key: RouteKey = `${method} ${pattern}`;

		// TODO: allow multiple handlers per route (middleware?)
		if (this.#routes.has(key)) {
			logger.warning(`A handler for "${method} ${pattern}" is already registered. Skipping…`);
			return this;
		}

		this.#routes.set(key, handler);

		return this;
	}

	/** Registers a GET handler */
	get(pattern: Pattern, handler: Handler) {
		return this.register("GET", pattern, handler);
	}

	/** Registers a POST handler */
	post(pattern: Pattern, handler: Handler) {
		return this.register("POST", pattern, handler);
	}

	/** Registers a PUT handler */
	put(pattern: Pattern, handler: Handler) {
		return this.register("PUT", pattern, handler);
	}

	/** Registers a PATCH handler */
	patch(pattern: Pattern, handler: Handler) {
		return this.register("PATCH", pattern, handler);
	}

	/** Registers a DELETE handler */
	del(pattern: Pattern, handler: Handler) {
		return this.register("DELETE", pattern, handler);
	}

	/** Registers an OPTIONS handler */
	options(pattern: Pattern, handler: Handler) {
		return this.register("OPTIONS", pattern, handler);
	}

	/** Registers an ANY handler */
	any(pattern: Pattern, handler: Handler) {
		return this.register("ANY", pattern, handler);
	}
}

export async function fromFileSystem(path: string): Promise<Router> {
	const router = new Router();
	const base = toFileUrl(path);
	const options: WalkOptions = {
		exts: ["ts", "tsx", "js", "jsx"],
		followSymlinks: false,
		includeDirs: false,
		includeFiles: true,
	};

	// walk on path
	for await (const entry of walk(base, options)) {
		const relative = entry.path.replace(base.pathname, "");
		const pattern = toPattern(relative);

		const module = await import(entry.path);
		const { handler } = module;

		// handler fn provided
		if (typeof handler === "function") {
			router.any(pattern, handler);
		} // handler map provided
		else if (handler instanceof Map) {
			for (const [method, handlerFn] of handler) {
				router.register(method, pattern, handlerFn);
			}
		}

		logger.debug("\n", relative, "\n", pattern, "\n", handler, "\n");
	}

	logger.debug("=== routes ===", "\n", router.routes);

	return router;
}

/** Find the best route match for a given request */
export function getRouteMatch(
	request: Request,
	routes: RouteMap,
): [Pattern, Handler] {
	const method = toMethod(request.method);
	const { pathname } = new URL(request.url);

	let pattern = toPattern("*");
	let handler = toHandler();

	for (const [routeKey, routeHandler] of routes) {
		// break route key into method and pattern parts
		const [routeKeyMethod, routeKeyPattern] = routeKey.split(" ");
		const routeMethod = toMethod(routeKeyMethod ?? "");
		const routePattern = toPattern(routeKeyPattern ?? "");

		const match = new URLPattern({ pathname: routePattern }).test({ pathname });

		if ([method, "ANY"].includes(routeMethod) && match) {
			pattern = routePattern;
			handler = routeHandler;
		}
	}

	return [pattern, handler];
}

/** The default `Not Found` handler */
export function notFoundHandler() {
	const status = Status.NotFound;
	return new Response(null, {
		status,
		statusText: STATUS_TEXT[status],
		headers: {
			"content-type": "text/plain; charset=UTF-8",
		},
	});
}

/** Transforms a given string into a valid Method. Fallback to `ANY` */
export function toMethod(method: string): Method {
	const upper = method.toUpperCase();
	return isMethod(upper) ? upper : "ANY";
}

/**
 * Transforms a given string into an URLPattern `pathname` pattern. Fallback to `"*".
 *
 * Handles file-system paths as well
 *
 * Examples:
 * - `/index.ts` to `/`
 * - `/users/[id].ts` to `/users/:id`
 * - `/[category]/[subcategory].ts` to `/:category/:subcategory`
 */
export function toPattern(pathname: string): Pattern {
	let pattern: Pattern = "*";
	let segments = pathname.split("/");

	// remove first segment part
	if (segments[0] === "") {
		segments.shift();
	}

	// `/name.{t|j}s{x}?` -> `/name`
	segments[segments.length - 1] = segments.at(-1)?.replace(extname(pathname), "") ?? "";

	// `/index` -> `/`
	if (segments[segments.length - 1] === "index") {
		segments.pop();
	}

	segments = segments.map((segment) => {
		// `/[...id]` -> `/:id*`
		if (segment.startsWith("[...") && segment.endsWith("]")) {
			return `:${segment.slice(4, segment.length - 1)}*`;
		}

		// `/[id]` -> `/:id`
		if (segment.startsWith("[") && segment.endsWith("]")) {
			return `:${segment.slice(1, segment.length - 1)}`;
		}

		return segment;
	});

	const joinedSegments = `/${segments.join("/")}`;

	if (isPattern(joinedSegments)) {
		pattern = joinedSegments;
	}

	// `/nested/index.ts` -> `/nested` (not `/nested/`)
	// if (pattern.endsWith("/")) {
	// 	pattern = pattern.slice(0, -1) + "{/*}?";
	// }

	return pattern;
}

/** Parses a pathname into a key-value params object for a given pattern. */
export function toParams(pathname: string, pattern: Pattern): Params {
	return new URLPattern({ pathname: pattern })
		.exec({ pathname })?.pathname.groups ?? {};
}

/** Transforms a given function into a Handler. Fallback to `notFoundHandler` */
export function toHandler(fn?: unknown, fallback: Handler = notFoundHandler): Handler {
	return isHandler(fn) ? fn : fallback;
}

/** A type guard that determines if the input is a valid Method. */
export function isMethod(input: string): input is Method {
	return Object.values(METHODS).includes(input as Method);
}

/** A type guard that determines if the input is a valid Pattern. */
export function isPattern(input: string): input is Pattern {
	return typeof input === "string" && (input === "*" || input.startsWith("/"));
}

/** A type guard that determines if the input is a Router. */
// deno-lint-ignore no-explicit-any
export function isRouter(input: any): input is Router {
	return "handler" in input && isHandler(input.handler);
}

/** A type guard that determines if the input is a Handler. */
export function isHandler(input: unknown): input is Handler {
	// TODO: improve handler fn detection
	return typeof input === "function";
}
