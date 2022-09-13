import { asserts } from "./deps.ts";
import { LogLevel } from "./level.ts";
import { LogRecord } from "./record.ts";

const { assertEquals } = asserts;

Deno.test("LogRecord has a 'debug' level", () => {
	const record = new LogRecord({
		level: LogLevel.DEBUG,
		message: "Hello World!",
	});

	assertEquals(record.level, LogLevel.DEBUG);
});

Deno.test("LogRecord has a 'info' level", () => {
	const record = new LogRecord({
		level: LogLevel.INFO,
		message: "Hello World!",
	});

	assertEquals(record.level, LogLevel.INFO);
});

Deno.test("LogRecord has a 'notice' level", () => {
	const record = new LogRecord({
		level: LogLevel.NOTICE,
		message: "Hello World!",
	});

	assertEquals(record.level, LogLevel.NOTICE);
});

Deno.test("LogRecord has a 'warning' level", () => {
	const record = new LogRecord({
		level: LogLevel.WARNING,
		message: "Hello World!",
	});

	assertEquals(record.level, LogLevel.WARNING);
});

Deno.test("LogRecord has a 'error' level", () => {
	const record = new LogRecord({
		level: LogLevel.ERROR,
		message: "Hello World!",
	});

	assertEquals(record.level, LogLevel.ERROR);
});

Deno.test("LogRecord has a 'critical' level", () => {
	const record = new LogRecord({
		level: LogLevel.CRITICAL,
		message: "Hello World!",
	});

	assertEquals(record.level, LogLevel.CRITICAL);
});

Deno.test("LogRecord has a 'alert' level", () => {
	const record = new LogRecord({
		level: LogLevel.ALERT,
		message: "Hello World!",
	});

	assertEquals(record.level, LogLevel.ALERT);
});

Deno.test("LogRecord has a 'emergency' level", () => {
	const record = new LogRecord({
		level: LogLevel.EMERGENCY,
		message: "Hello World!",
	});

	assertEquals(record.level, LogLevel.EMERGENCY);
});

Deno.test("LogRecord has a message", () => {
	const record = new LogRecord({
		level: LogLevel.EMERGENCY,
		message: "Hello World!",
	});

	assertEquals(record.message, "Hello World!");
});

Deno.test("LogRecord has a datetime in ISO format", () => {
	const record = new LogRecord({
		level: LogLevel.EMERGENCY,
		message: "Hello World!",
	});
	assertEquals(record.timestamp, new Date(record.timestamp).toISOString());
});
