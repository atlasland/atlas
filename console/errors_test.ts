import { assertEquals, assertThrows } from "./deps.ts";
import {
	InvalidArgumentError,
	InvalidCommandError,
	InvalidOptionError,
} from "./errors.ts";

Deno.test("InvalidArgumentError accepts a message", () => {
	const error = new InvalidArgumentError('Invalid argument "argument"');
	assertEquals(error.message, 'Invalid argument "argument"');
});

Deno.test("InvalidArgumentError has a type of InvalidArgumentError", () => {
	assertThrows(() => {
		throw new InvalidArgumentError();
	}, InvalidArgumentError);
});

Deno.test("InvalidCommandError accepts a message", () => {
	const error = new InvalidCommandError('Invalid command "command"');
	assertEquals(error.message, 'Invalid command "command"');
});

Deno.test("InvalidCommandError has a type of InvalidCommandError", () => {
	assertThrows(() => {
		throw new InvalidCommandError();
	}, InvalidCommandError);
});

Deno.test("InvalidOptionError accepts a message", () => {
	const error = new InvalidOptionError('Invalid option "option"');
	assertEquals(error.message, 'Invalid option "option"');
});

Deno.test("InvalidOptionError has a type of InvalidOptionError", () => {
	assertThrows(() => {
		throw new InvalidOptionError();
	}, InvalidOptionError);
});
