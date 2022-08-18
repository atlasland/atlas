import { default as logger } from "../log/mod.ts";
import { type Args } from "./deps.ts";
import { type Handler, type Program, ProgramContext } from "./program.ts";

export class Command implements Program {
	/** The command name. */
	readonly name: string;

	/** The command description. */
	readonly description?: string;

	/** The command arguments. */
	#arguments?: Map<Argument["name"], Argument>;

	/** The command options. */
	#options?: Map<Option["name"], Option>;

	/** The command help text. */
	readonly help?: string;

	/**
	 * Indicates whether the command should be shown in the commands list.
	 * Defaults to `false`.
	 */
	readonly hidden?: boolean;

	/** The command handler function. */
	readonly #handler: Handler;

	constructor(name: Command["name"], options: CommandOptions) {
		this.name = name;
		this.description = options?.description;
		this.help = options?.help;
		this.hidden = options?.hidden ?? false;
		this.#handler = options.handler;

		// register command arguments
		for (const name in options?.arguments) {
			if (Object.prototype.hasOwnProperty.call(options.arguments, name)) {
				const arg: Argument = {
					name,
					...options.arguments[name],
				};
				this.#registerArgument(arg);
			}
		}

		// register command options
		for (const name in options?.options) {
			if (Object.prototype.hasOwnProperty.call(options.options, name)) {
				const opt: Option = {
					name,
					...options.options[name],
				};
				this.#registerOption(opt);
			}
		}
	}

	#registerArgument(argument: Argument): void {
		if (!this.#arguments?.has(argument.name)) {
			this.#arguments?.set(argument.name, argument);
		}
	}

	#registerOption(option: Option): void {
		if (!this.#options?.has(option.name)) {
			this.#options?.set(option.name, option);
		}
	}

	/**
	 * Runs the command
	 */
	async run(args: Args): Promise<void> {
		const context: ProgramContext = {};

		try {
			await this.#handler(args, context);
			return Deno.exit(0);
		} catch (error: unknown) {
			logger.error((error as Error).message);
			return Deno.exit(1);
		}
	}
}

interface CommandOptions {
	description?: Command["description"];
	arguments?: Record<string, Omit<Argument, "name">>;
	options?: Record<string, Omit<Option, "name">>;
	help?: Command["help"];
	hidden?: Command["hidden"];
	handler: Handler;
}

export type Argument = {
	name: string;
	description?: string;
	type: "string";
	default?: string | string[];
} | {
	name: string;
	description?: string;
	type: "number";
	default?: number | number[];
};

export type Option = {
	name: string;
	description?: string;
	type: "string";
	alias?: string | string[];
	collectable?: boolean;
	negatable?: boolean;
	default?: string | string[];
} | {
	name: string;
	description?: string;
	type: "boolean";
	alias?: string | string[];
	negatable?: boolean;
	default?: boolean;
} | {
	name: string;
	description?: string;
	type: "number";
	alias?: string | string[];
	collectable?: boolean;
	default?: number | number[];
};
