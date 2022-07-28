import { assertEquals, assertThrows } from "./deps.ts";
import { MissingArgumentError } from "./errors.ts";

Deno.test({
	name: "[error] MissingArgumentError",
	fn: () => {
		const error = new MissingArgumentError("argument_name");
		assertEquals(error.message, "Missing argument: argument_name");
		assertThrows(() => {
			throw error;
		}, MissingArgumentError);
	},
});
