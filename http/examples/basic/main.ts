import { start } from "../../mod.ts";

function handler() {
	return { message: "hello world!" };
}

await start(handler);
