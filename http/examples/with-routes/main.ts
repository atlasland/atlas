import { Router, start } from "../../mod.ts";

const router = new Router();

router.get("/", () => {
	return { message: "A GET handler" };
});

router.post("/", () => {
	return { message: "A POST handler" };
});

await start(router);
