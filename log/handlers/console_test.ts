import { asserts } from "../deps.ts";

const { assertEquals, assertStringIncludes } = asserts;
const decoder = new TextDecoder();

{
	const [stdout, stderr] = await runFixture("level");

	// stdout
	for (const level of ["debug", "info", "notice"]) {
		Deno.test(`ConsoleHandler writes to stdout for \`${level}\` level`, () => {
			assertStringIncludes(stdout, level);
		});
	}

	// stderr
	for (const level of ["warning", "error", "critical", "emergency"]) {
		Deno.test(`ConsoleHandler writes to stderr for \`${level}\` level`, () => {
			assertStringIncludes(stderr, level);
		});
	}
}

Deno.test("ConsoleHandler prints the logger name", async () => {
	const [stdout] = await runFixture("name");
	assertStringIncludes(stdout.split("\n").at(0) ?? "", "[name]");
});

Deno.test("ConsoleHandler prints the timestamp for a log record", async () => {
	const [stdout] = await runFixture("timestamp");

	assertStringIncludes(
		stdout.split("\n").at(0) ?? "",
		new Date().toISOString().slice(0, -4),
	);
});

Deno.test("ConsoleHandler formats a record to JSON", async () => {
	const [stdout] = await runFixture("json");
	assertEquals(stdout, `{"level":"debug","message":"hello"}\n`);
});

Deno.test("ConsoleHandler colorizes a log record level", async () => {
	const [stdout] = await runFixture("color");

	// [90mdebug[39m
	// ^^^^---------
	assertStringIncludes(stdout, "[90m");

	// [90mdebug[39m
	// ---------^^^^
	assertStringIncludes(stdout.slice(11, 15), "[39m");
});

/** run a test fixture on a sub-process to and caputure the output for assertions */
async function runFixture(fixture: string): Promise<[string, string]> {
	const process = Deno.run({
		cmd: [
			"deno",
			"run",
			`./log/handlers/console_test.fixture.${fixture}.ts`,
		],
		stdout: "piped",
		stderr: "piped",
	});

	const stdout = decoder.decode(await process.output());
	const stderr = decoder.decode(await process.stderrOutput());

	process.close();

	return [stdout, stderr];
}
