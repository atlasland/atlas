import { assertEquals } from "../deps_dev.ts";
import { ConnInfo, logger, Status, STATUS_TEXT } from "./deps.ts";
import { Method, type RouteMap, Router } from "./router.ts";

Deno.test("[http/router] router.register() registers a new handler", () => {
	const router = new Router();
	const handler = () => ({});
	const expectations: RouteMap = new Map();

	for (const method of Object.values(Method)) {
		expectations.set(method, new Map([["/", handler]]));
		router.register(method, "/", handler);
	}

	assertEquals(router.routes, expectations);
});

for (const method of Object.values(Method)) {
	const fn = (method === Method.DELETE) ? "del" : method.toLowerCase();

	Deno.test(`[http/router] router.${fn}() registers a new ${method} handler`, () => {
		const router = new Router();
		const handler = () => ({});

		// deno-lint-ignore ban-ts-comment
		// @ts-ignore
		router[fn]("/", handler);

		assertEquals(
			router.routes,
			new Map([
				[method, new Map([["/", handler]])],
			]),
		);
	});
}

Deno.test("[http/router] Router.toPattern() returns a valid URLPattern pattern", () => {
	const expectations = new Map([
		[Router.toPattern("/index.ts"), "/"],
		[Router.toPattern("/[id].ts"), "/:id"],
		[
			Router.toPattern("/test/[category]/[subcategory].ts"),
			"/test/:category/:subcategory",
		],
	]);

	for (const [pattern, expected] of expectations) {
		assertEquals(pattern, expected);
	}
});

Deno.test("[http/router] Router.toParams() returns a key-value object of URL params", () => {
	const expectations = new Map<Record<string, string>, Record<string, string>>([
		[Router.toParams("/", "/"), {}],
		[Router.toParams("/123", "/:id"), { id: "123" }],
		[
			Router.toParams(
				"/test/category-1/subcategory-2",
				"/test/:category/:subcategory",
			),
			{
				category: "category-1",
				subcategory: "subcategory-2",
			},
		],
	]);

	for (const [pattern, expected] of expectations) {
		assertEquals(pattern, expected);
	}
});

Deno.test(
	"[http/router] router.handler() handles an incoming request with the provided Handler fn",
	{ ignore: true },
	async () => {
		const request = new Request(new URL("/", "http://localhost:8000"), {
			method: Method.GET,
		});
		const response = new Response("ok", {
			status: Status.OK,
			statusText: STATUS_TEXT[Status.OK],
			headers: { "content-type": "text/plain; charset=UTF-8" },
		});
		const router = new Router().get("/", () => response);
		const connection: ConnInfo = {
			localAddr: {
				hostname: "localhost",
				port: 8000,
				transport: "tcp",
			},
			remoteAddr: {
				hostname: "localhost",
				port: 8000,
				transport: "tcp",
			},
		};

		const expectation = await router.handler(request, connection);

		logger.debug(expectation);
		logger.debug(response);

		assertEquals(expectation, response);
	},
);
