import { start } from "../../mod.ts";

function handler() {
	return new Response(
		JSON.stringify({ message: "hello world" }),
		{
			headers: { "content-type": "application/json" },
		},
	);
}

await start(handler);
