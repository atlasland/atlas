import { asserts } from "../../deps.ts";
import { LogLevel } from "../level.ts";
import { Logger } from "../logger.ts";
import { LogRecord } from "../record.ts";
import { ConsoleHandler } from "./console.ts";

const { assertEquals, assertStringIncludes } = asserts;

class TestWriter implements Deno.Writer {
	public buffer: Uint8Array = new Uint8Array();

	async write(data: Uint8Array): Promise<number> {
		this.buffer = data;
		return data.buffer.byteLength;
	}
}

Deno.test("[log] console: prints the logger name", () => {
	const writer = new TestWriter();
	const logger = new Logger("test", {
		handlers: [
			new ConsoleHandler({
				name: true,
				target: writer,
			}),
		],
	});

	logger.debug("this is a debug message");

	assertStringIncludes(
		new TextDecoder().decode(writer.buffer),
		"[test]",
	);
});

Deno.test("[log] console: prints the datetime for a log record", () => {
	const record = new LogRecord({ level: LogLevel.DEBUG, message: "hello" });
	const writer = new TestWriter();
	const handler = new ConsoleHandler({
		color: false,
		target: writer,
		datetime: true,
	});

	handler.handle({ record });

	assertEquals(
		new TextDecoder().decode(writer.buffer),
		`${record.datetime} debug hello\n`,
	);
});

Deno.test("[log] console: formats a record to JSON", () => {
	const record = new LogRecord({ level: LogLevel.DEBUG, message: "hello" });
	const writer = new TestWriter();
	const handler = new ConsoleHandler({
		json: true,
		target: writer,
	});

	handler.handle({ record });

	assertEquals(
		new TextDecoder().decode(writer.buffer),
		`{"level":"debug","message":"hello"}\n`,
	);
});

Deno.test("[log] console: colorizes a log record level", () => {
	const record = new LogRecord({ level: LogLevel.DEBUG, message: "hello" });
	const writer = new TestWriter();
	const handler = new ConsoleHandler({
		color: true,
		target: writer,
	});

	handler.handle({ record });

	// [90mdebug[39m
	// ^^^^---------
	assertStringIncludes(
		new TextDecoder().decode(writer.buffer).slice(0, 5),
		"[90m",
	);

	// [90mdebug[39m
	// ---------^^^^
	assertStringIncludes(
		new TextDecoder().decode(writer.buffer).slice(11, 15),
		"[39m",
	);
});

// TODO(gabrielizaias): figure out how to mock stdout/stderr
// Deno.test("defaults to stdout for `debug`, `info`, `notice`, and `warning`", () => {});
// Deno.test("defaults to stderr for `error`, `critical`, `alert`, and `emergency`", () => {});
