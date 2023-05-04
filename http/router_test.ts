import { assertEquals } from "../deps_dev.ts";
import { Status, STATUS_TEXT } from "./deps.ts";
import {
	type Handler,
	isMethod,
	isPattern,
	isRouter,
	METHODS,
	notFound,
	type Params,
	type RouteMap,
	Router,
	toHandler,
	toMethod,
	toParams,
	toPattern,
} from "./router.ts";

Deno.test("[http/router] router.register() registers a new handler", () => {
	const router = new Router();
	const handler = () => ({});
	const routes: RouteMap = new Map();

	for (const method of Object.values(METHODS)) {
		routes.set(`${method} /`, handler);
		router.register(method, "/", handler);
	}

	assertEquals(router.routes, routes);
});

for (const method of Object.values(METHODS)) {
	const fn = method === METHODS.DELETE ? "del" : method.toLowerCase();

	Deno.test(`[http/router] router.${fn}() registers a new ${method} handler`, () => {
		const router = new Router();
		const handler: Handler = () => ({});

		// deno-lint-ignore ban-ts-comment
		// @ts-ignore
		router[fn]("/", handler);

		assertEquals(
			router.routes,
			new Map([[`${method} /`, handler]]),
		);
	});
}

Deno.test("[http/router] router.handler() returns a Response", async () => {
	const data = new Response("ok", { statusText: STATUS_TEXT[Status.OK] });
	const router = new Router().get("/", () => data);
	const request = new Request(new URL("/", "http://localhost:8000"));

	const response = await router.handler(request);

	assertEquals(response.url, data.url);
	assertEquals(response.type, data.type);
	assertEquals(response.headers.entries(), data.headers.entries());
	assertEquals(response.body, data.body);
	assertEquals(response.bodyUsed, data.bodyUsed);
	assertEquals(response.ok, data.ok);
	assertEquals(response.redirected, data.redirected);
	assertEquals(response.status, data.status);
	assertEquals(response.statusText, data.statusText);
});

Deno.test("[http/router] router.handler() returns an object response as JSON", async () => {
	const data = { message: "ok" };
	const router = new Router().get("/", () => data);
	const request = new Request(new URL("/", "http://localhost:8000"));

	const response = await router.handler(request);

	assertEquals(response.headers.get("content-type"), "application/json");
	assertEquals(await response.json(), data);
});

Deno.test("[http/router] router.handler() handles thrown HTTP statuses", async () => {
	const router = new Router().get("/", () => {
		throw Status.Forbidden;
	});
	const request = new Request(new URL("/", "http://localhost:8000"));

	const response = await router.handler(request);

	assertEquals(response.status, Status.Forbidden);
});

Deno.test("[http/router] passes URL params to handler context", async () => {
	const params: Params = {};
	const router = new Router()
		.get("/:id", (_, { params: { id } }) => {
			params.id = id;
			return {};
		})
		.get(
			"/:category/:subcategory",
			(_, { params: { category, subcategory } }) => {
				params.category = category;
				params.subcategory = subcategory;
				return {};
			},
		);

	const request1 = new Request(new URL("/12345", "http://localhost:8000"));
	const request2 = new Request(
		new URL("/computers/laptops", "http://localhost:8000"),
	);

	await router.handler(request1);
	await router.handler(request2);

	assertEquals(params.id, "12345");
	assertEquals(params.category, "computers");
	assertEquals(params.subcategory, "laptops");
});

Deno.test("[http/router] isRouter() correctly determines if the input is a Router", () => {
	const expectations = new Map([
		[isRouter(new Router()), true],
		[isRouter({ handler: () => {} }), true],
		[isRouter({}), false],
		[isRouter("*"), false],
		[isRouter(""), false],
		[isRouter([]), false],
		[isRouter(new Map()), false],
		[isRouter(123), false],
		[isRouter(undefined), false],
		[isRouter(null), false],
	]);

	for (const [input, expected] of expectations) {
		assertEquals(input, expected);
	}
});

Deno.test("[http/router] isMethod() correctly determines if the input is a valid Method", () => {
	const expectations = new Map([
		[isMethod("get"), true],
		[isMethod("GET"), true],
		[isMethod("post"), true],
		[isMethod("put"), true],
		[isMethod("patch"), true],
		[isMethod("del"), true],
		[isMethod("delete"), false],
		[isMethod("options"), true],
		[isMethod("any"), true],
		[isMethod("*"), false],
		[isMethod("__gibberish__"), false],
		[isMethod("123456709"), false],
		[isMethod(""), false],
		[isMethod(undefined as unknown as string), false],
		[isMethod({} as unknown as string), false],
	]);

	for (const [input, expected] of expectations) {
		assertEquals(input, expected);
	}
});

Deno.test("[http/router] toMethod() returns a valid HTTP Method", () => {
	const expectations = new Map([
		[toMethod("get"), METHODS.GET],
		[toMethod("GET"), METHODS.GET],
		[toMethod("post"), METHODS.POST],
		[toMethod("put"), METHODS.PUT],
		[toMethod("patch"), METHODS.PATCH],
		[toMethod("del"), METHODS.DELETE],
		[toMethod("delete"), METHODS.DELETE],
		[toMethod("options"), METHODS.OPTIONS],
		[toMethod("any"), METHODS.ANY],
		[toMethod("*"), METHODS.ANY],
		[toMethod("__gibberish__"), METHODS.ANY],
		[toMethod("123456709"), METHODS.ANY],
	]);

	for (const [method, expected] of expectations) {
		assertEquals(method, expected);
	}
});

Deno.test("[http/router] isPattern() correctly determines if the input is a valid Pattern", () => {
	const expectations = new Map([
		[isPattern("/"), true],
		[isPattern("*"), true],
		[isPattern("/:test"), true],
		[isPattern("/abc/123"), true],
		[isPattern("/:one/:two/:three"), true],
		[isPattern(""), false],
		[isPattern(undefined as unknown as string), false],
		[isPattern({} as unknown as string), false],
	]);

	for (const [input, expected] of expectations) {
		assertEquals(input, expected);
	}
});

Deno.test("[http/router] toPattern() returns a valid URLPattern pattern", () => {
	const expectations = new Map([
		[toPattern("/index.ts"), "/"],
		[toPattern("/nested/index.ts"), "/nested"],
		[toPattern("/[id].ts"), "/:id"],
		[
			toPattern("/categories/[category]/[subcategory].ts"),
			"/categories/:category/:subcategory",
		],
		[toPattern("/[...slug].ts"), "/:slug*"],
	]);

	for (const [pattern, expected] of expectations) {
		assertEquals(pattern, expected);
	}
});

Deno.test("[http/router] toParams() returns a key-value object of URL params", () => {
	const expectations = new Map([
		[toParams("/", "/"), {}],
		[toParams("/123", "/:id"), { id: "123" }],
		[
			toParams(
				"/test/category-1/subcategory-2",
				"/test/:category/:subcategory",
			),
			{
				category: "category-1",
				subcategory: "subcategory-2",
			},
		],
		[toParams("/pokemons/pikachu", "/:catchAll*"), { catchAll: "pokemons/pikachu" }],
		[
			toParams(
				"/level1/1/level2/2/and/abc/def/ghi",
				"/level1/:value1/level2/:value2/and/:anything*",
			),
			{
				value1: "1",
				value2: "2",
				anything: "abc/def/ghi",
			},
		],
	]);

	for (const [pattern, expected] of expectations) {
		assertEquals(pattern, expected);
	}
});

Deno.test("[http/router] toHandler() returns a Handler function", () => {
	const fn: Handler = () => ({});
	const expectations = new Map([
		[toHandler(), notFound],
		[toHandler(fn), fn],
		[toHandler("/", notFound), notFound],
		[toHandler(null, fn), fn],
	]);

	for (const [handler, expected] of expectations) {
		assertEquals(handler, expected);
	}
});

Deno.test("[http/router] notFound() returns an HTTP 404 response", () => {
	const response = notFound();
	assertEquals(response.status, Status.NotFound);
	assertEquals(response.statusText, STATUS_TEXT[Status.NotFound]);
});
