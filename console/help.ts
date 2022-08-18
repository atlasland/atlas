import { type Application } from "./application.ts";
import { type Command } from "./command.ts";
import { green } from "./deps.ts";

/**
 * Generates the help output for a given console application or command.
 */
export function help(program: Application | Command): string {
	let output = `${green(program.name)}`;

	// description
	if (program.description) {
		output = `${output}
${program.description}`;
	}

	// help
	if (program.help) {
		output = `${output}

${program.help}`;
	}

	// usage
	// 	if (helpable.arguments || helpable.options) {
	// 		output = `${output}
	//
	// ${yellow("USAGE:")}`;
	// 	}
	//
	// 	// options
	// 	if (helpable.options) {
	// 		output = `${output}${getOptions(helpable.options)}`;
	// 	}
	//
	// 	// arguments
	// 	if (helpable.arguments) {
	// 		output = `${output}${getArguments(helpable.arguments)}`;
	// 	}

	return output;
}

// function getOptions(options: Command["options"]): string {
// 	let output = "";
//
// 	for (const option in options) {
// 		const alias = options[option]?.alias ?? [];
// 		const description = options[option]?.description ?? "";
//
// 		let aliases = Array.isArray(alias) ? alias : [alias];
//
// 		aliases = aliases.map((alias) => green(`-${alias}`));
// 		aliases.push(green(`--${option}`));
//
// 		output = `${output}
//     ${aliases.join(", ")}
//         ${description}`;
// 	}
//
// 	return `
//
// ${yellow("OPTIONS:")}${output}`;
// }
//
// function getArguments(args: Command["arguments"]): string {
// 	let output = "";
//
// 	for (const arg in args) {
// 		const description = args[arg]?.description ?? "";
//
// 		output = `${output}
//     ${green(arg)}
//         ${description}`;
// 	}
//
// 	return `
//
// ${yellow("ARGS:")}${output}`;
// }
