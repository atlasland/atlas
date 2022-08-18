import { Application } from "./application.ts";
import { assertEquals, assertSpyCall, assertThrows, spy } from "./deps.ts";
import { Command } from "./command.ts";

Deno.test("create a new console application", () => {
	const app = new Application("test", {
		version: "1.0.0",
		description: "A test console application",
	});
	assertEquals(app.name, "test");
	assertEquals(app.version, "1.0.0");
	assertEquals(app.description, "A test console application");
});

Deno.test("register() adds a command to the application instance", {
	ignore: true,
}, () => {});

Deno.test("register() throws error when registering empty array of commands", () => {
	assertThrows(
		() => {
			new Application("test").register([]);
		},
		Error,
		"Cannot register an empty list of commands",
	);
});

Deno.test("register() throws error when registering two commands with the same name", () => {
	assertThrows(
		() => {
			new Application("test").register([
				new Command("test", {
					handler: () => {},
				}),
				new Command("test", {
					handler: () => {},
				}),
			]);
		},
	);
});

Deno.test("run() executes the appliation handler", async () => {
	const handlerFn = spy(() => {});
	const app = new Application("test", {
		handler: handlerFn,
	});
	await app.run();
	assertSpyCall(handlerFn, 0);
});
