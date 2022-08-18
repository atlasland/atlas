import { type Args } from "./deps.ts";

export interface Program {
	/** The program name */
	name: string;

	/** The program description */
	description?: string;

	/** The program help text */
	help?: string;

	/** The program handler */
	handler?: Handler;
}

/** The handler for a console program */
export type Handler = (
	args: Args,
	context: ProgramContext,
) => Promise<void> | void;

export type ProgramContext = {
	[key: string]: unknown;
};
