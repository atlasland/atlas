import { assertEquals, assertStringIncludes } from "../../deps_dev.ts";

const decoder = new TextDecoder();

{
	const [stdout, stderr] = await runFixture("level");

	// stdout
	for (const level of ["debug", "info", "notice"]) {
		Deno.test(`[log/handlers] ConsoleHandler writes to stdout for \`${level}\` level`, () => {
			assertStringIncludes(stdout, level);
		});
	}

	// stderr
	for (const level of ["warning", "error", "critical", "emergency"]) {
		Deno.test(`[log/handlers] ConsoleHandler writes to stderr for \`${level}\` level`, () => {
			assertStringIncludes(stderr, level);
		});
	}
}

Deno.test("[log/handlers] ConsoleHandler prints the logger name", async () => {
	const [stdout] = await runFixture("name");
	assertStringIncludes(getLine(stdout), "[name]");
});

Deno.test("[log/handlers] ConsoleHandler prints the timestamp for a log record", async () => {
	const [stdout] = await runFixture("timestamp");
	assertStringIncludes(
		getLine(stdout),
		new Date().toISOString().slice(0, -5),
	);
});

Deno.test("[log/handlers] ConsoleHandler prints stringified objects", async () => {
	const [stdout] = await runFixture("object");
	assertEquals(getLine(stdout), `debug { key: "value" }`);
});

Deno.test("[log/handlers] ConsoleHandler formats a record to JSON", async () => {
	const [stdout] = await runFixture("json");
	assertEquals(
		getLine(stdout),
		`{"level":"debug","message":["hello",{"key":"value"},[1,2,3],null,true]}`,
	);
});

Deno.test("[log/handlers] ConsoleHandler colorizes a log record level", async () => {
	const [stdout] = await runFixture("color");

	// [90mdebug[39m
	// ^^^^---------
	assertStringIncludes(stdout, "[90m");

	// [90mdebug[39m
	// ---------^^^^
	assertStringIncludes(stdout.slice(11, 15), "[39m");
});

/** Runs a test fixture on a sub-process and caputure the output for assertions */
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

/** Retrieves a given line from a process output */
function getLine(output: string, line = 0): string {
	return output.split("\n").at(line) ?? "";
}
