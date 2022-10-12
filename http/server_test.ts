import { assertEquals } from "../deps_dev.ts";
import { Router } from "./router.ts";
import { Server } from "./server.ts";

Deno.test("[http/server] server.router has a router instance", () => {
	const router = new Router();
	const server = new Server(router);
	assertEquals(server.router, router);
});

Deno.test("[http/server] server.serve starts listenin for incoming requests", {
	ignore: true,
}, () => {});
