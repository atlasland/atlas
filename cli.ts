import { Application, Command } from "./console/mod.ts";
import { default as logger } from "./log/mod.ts";
import VERSIONS from "./versions.json" assert { type: "json" };

if (import.meta.main) {
	const cli = new Application("atlas", {
		version: VERSIONS.at(0),
		description: "A web application framework for Deno",
		help: "this is root help",
		handler: (args, context) => {
			console.debug({ args, context });
		},
	});

	/** Creates a new resource for an Atlas application */
	const create = new Command("new", {
		description: "Creates a new resource for an Atlas application",
		help: "new command help",
		arguments: {
			model: {
				type: "string",
				default: 123, // this should be a TypeError
				description: "Creates a new model",
			},
		},
		handler: (_args) => {
			logger.notice("The `atlas new` command is not implemented yet");
		},
	});

	/** Starts an Atlas application */
	const start = new Command("start", {
		description: "Starts an Atlas application",
		options: {
			port: {
				type: "number",
				default: "asd",
				description: "The port where to start the application listener",
			},
		},
		handler: (_args) => {
			logger.notice("The `atlas start` command is not implemented yet");
		},
	});

	await cli
		.register([create, start])
		.run();
}
