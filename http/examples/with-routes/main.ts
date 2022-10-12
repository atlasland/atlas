import { Router, start } from "../../mod.ts";

const router = new Router();

router.get("/", () => {
	return new Response(
		JSON.stringify({ message: "A GET handler" }),
		{ headers: { "content-type": "application/json" } },
	);
});

router.post("/", () => {
	return new Response(
		JSON.stringify({ message: "A POST handler" }),
		{ headers: { "content-type": "application/json" } },
	);
});

await start(router);
