import { default as logger } from "../log/mod.ts";
import { type Command } from "./command.ts";
import { parse } from "./deps.ts";
import { InvalidCommandError } from "./errors.ts";
import { help } from "./help.ts";
import { type Handler, type Program, ProgramContext } from "./program.ts";

type ApplicationOptions = {
	/** The application version. Defaults to "latest". */
	version?: string;

	/** The application description. */
	description?: string;

	/** The application help text. */
	help?: string;

	/** The application default handler. Useful for applications that don't have commands */
	handler?: Handler;
};

/**
 * A console application instance.
 */
export class Application implements Program {
	readonly name: string;
	readonly version?: string = "latest";
	readonly description?: string;
	readonly help?: string;
	#handler?: Handler;

	/** The application commands. */
	#commands: Map<Command["name"], Command> = new Map();

	constructor(name: Application["name"], options?: ApplicationOptions) {
		this.name = name;
		this.version = options?.version;
		this.description = options?.description;
		this.help = options?.help;

		if (options?.handler) {
			this.#handler = options.handler;
		}
	}

	/** Register commands for the console application */
	register(command: Command): this;
	register(commands: Command[]): this;
	register(commands: Command | Command[]): this {
		const cmds = Array.isArray(commands) ? commands : [commands];

		if (cmds.length === 0) {
			throw new Error("Cannot register an empty list of commands");
		}

		cmds.forEach((command) => {
			if (this.#commands.has(command.name)) {
				throw new InvalidCommandError(
					`Command "${command.name}" already exists`,
				);
			}

			this.#commands.set(command.name, command);
		});

		return this;
	}

	#hasHandler(): boolean {
		return typeof this.#handler === "function";
	}

	/** Runs the console application */
	async run(): Promise<void> {
		const args = parse(Deno.args);
		const context: ProgramContext = {};

		try {
			if (
				// `atlas`
				!args._?.at(0) && !this.#hasHandler() ||
				// `atlas [--help | -h]`
				args._.length === 0 && (args.help || args.h)
			) {
				// TODO: replace with custom logger instance
				console.log(help(this));
				return Deno.exit(0);
			}

			// `atlas`
			if (!args._?.at(0) && this.#handler) {
				await this.#handler(args, context);
				return Deno.exit(0);
			}

			const command = args._.at(0)?.toString() ?? "";

			if (!this.#commands.has(command)) {
				throw new InvalidCommandError(`Command "${command}" doesn't exist`);
			}

			// `atlas [command] [--help | -h]
			if (args.help || args.h) {
				await console.log(help(this.#commands.get(command) as Command));
				return Deno.exit(0);
			}

			this.#commands.get(command)?.run(args);
		} catch (error: unknown) {
			if (error instanceof InvalidCommandError) {
				logger.error(error.message);
				return Deno.exit(1);
			}
		}
	}
}
