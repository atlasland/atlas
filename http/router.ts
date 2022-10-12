import { type ConnInfo, extname, logger, Status, STATUS_TEXT } from "./deps.ts";

/** Supported HTTP methods.
 *
 * `ANY` is the wildcard value for any request method.
 */
export enum Method {
	GET = "GET",
	HEAD = "HEAD",
	POST = "POST",
	PUT = "PUT",
	DELETE = "DELETE",
	// CONNECT = "CONNECT",
	OPTIONS = "OPTIONS",
	// TRACE = "TRACE",
	PATCH = "PATCH",
	ANY = "ANY",
}

/** An `URLPattern` string to match against a `Request.pathname` */
export type Pattern = string;

export type RouteMap = Map<Method, Map<Pattern, Handler>>;

/** A handler function for a incoming Request */
export type Handler<P = Params> = (
	request: Request,
	context: Context<P>,
) => Response | Promise<Response> | Record<string, unknown>;

/** A special handler function that handles thrown errors */
export type ErrorHandler<P = Params> = (
	error: unknown,
	request?: Request,
	context?: Context<P>,
) => Response | Promise<Response>;

/** The Request context */
export type Context<P = Params> = Partial<ConnInfo> & {
	/** The path parameters found in the URL pathname */
	params: P;
};

/** The middleware Request context */
export type MiddlewareContext = Context & {
	/** Calls the next handler function for the Request */
	next?: () => Promise<void>;
};

/** The path parameteres found in the URL pathname */
export type Params = Record<string, string>;

export class Router {
	#routes: RouteMap;

	constructor() {
		this.#routes = new Map();
	}

	get routes() {
		return this.#routes;
	}

	/** Registers a GET handler */
	get(pattern: Pattern, handler: Handler) {
		return this.register(Method.GET, pattern, handler);
	}

	/** Registers a HEAD handler */
	head(pattern: Pattern, handler: Handler) {
		return this.register(Method.HEAD, pattern, handler);
	}

	/** Registers a POST handler */
	post(pattern: Pattern, handler: Handler) {
		return this.register(Method.POST, pattern, handler);
	}

	/** Registers a PUT handler */
	put(pattern: Pattern, handler: Handler) {
		return this.register(Method.PUT, pattern, handler);
	}

	/** Registers a DELETE handler */
	del(pattern: Pattern, handler: Handler) {
		return this.register(Method.DELETE, pattern, handler);
	}

	/** Registers a OPTIONS handler */
	options(pattern: Pattern, handler: Handler) {
		return this.register(Method.OPTIONS, pattern, handler);
	}

	/** Registers a PATCH handler */
	patch(pattern: Pattern, handler: Handler) {
		return this.register(Method.PATCH, pattern, handler);
	}

	/** Registers a ANY handler */
	any(pattern: Pattern, handler: Handler) {
		return this.register(Method.ANY, pattern, handler);
	}

	/** Registers a route handler */
	register(method: Method, pattern: Pattern, handler: Handler) {
		// create a new method map if it's the first time registering for this method
		if (!this.#routes.has(method)) {
			this.#routes.set(method, new Map());
		}

		// TODO(gabrielizaias): allow multiple handlers per route (middleware?)
		if (this.#routes.get(method)?.has(pattern)) {
			logger.warning(
				`A handler for "${method} ${pattern}" is already registered. Skipping…`,
			);
			return this;
		}

		this.#routes.get(method)?.set(pattern, handler);

		return this;
	}

	/** Handles an incoming request */
	async handler(request: Request, conection?: ConnInfo) {
		const { method } = request;
		const { pathname, search } = new URL(request.url);

		const [pattern, handler] = this.#getRouteMatch(request);
		const params = Router.toParams(pathname, pattern);
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

	/** Find the best route match for a given request */
	#getRouteMatch(request: Request): [Pattern, Handler] {
		const { method, url } = request;
		const { pathname } = new URL(url);

		let pattern: Pattern = "*";
		let handler: Handler = this.notFoundHandler;

		// TODO(gabrielizaias): handle request for assets

		if (this.#routes.has(method as Method) || this.#routes.has(Method.ANY)) {
			let patterns = this.#routes.get(method as Method);

			if (!patterns) {
				patterns = this.#routes.get(Method.ANY);
			}

			if (patterns) {
				for (const [_pattern] of patterns) {
					const urlPattern = new URLPattern({ pathname: _pattern });
					const match = urlPattern.test({ pathname });

					if (match) {
						pattern = _pattern;

						if (patterns.has(pattern)) {
							handler = patterns.get(pattern) ?? this.notFoundHandler;
						}
					}
				}
			}
		}

		return [pattern, handler];
	}

	/** The default `Not Found` handler */
	notFoundHandler: Handler = () => {
		throw Status.NotFound;
	};

	/** The default error handler */
	errorHandler: ErrorHandler = (error, _request, _context) => {
		let status = Status.InternalServerError;
		let body = `${STATUS_TEXT[status]}`;
		let headers = new Headers();

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
	};

	/** Transforms a file-system route path into an URLPattern `pathname` pattern.
	 *
	 * `/users/[id].ts` to `/users/:id`
	 * `/[category]/[subcategory].ts` to `/:category/:subcategory`
	 */
	static toPattern(pathname: string) {
		const pattern = pathname
			// `/index.ts` -> `/index`
			.replace(extname(pathname), "")
			// `/index` -> `/`
			.replace("index", "")
			// `/[id]` -> `/:id`
			.replaceAll("[", ":")
			.replaceAll("]", "");

		return pattern;
	}

	/** Parses a pathname into a key-value params object for a given pattern */
	static toParams(pathname: string, pattern: string) {
		return new URLPattern({ pathname: pattern })
			.exec({ pathname })?.pathname.groups ?? {};
	}
}
