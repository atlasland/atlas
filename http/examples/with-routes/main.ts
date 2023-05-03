import { Router, start } from "../../mod.ts";

const router = new Router();

router.get("/", () => {
	return {
		message: "A GET handler",
	};
});

router.post("/", () => {
	return {
		message: "A POST handler",
	};
});

router.get("/:id", (_request, { params }) => {
	return {
		id: params?.id,
	};
});

router.get("/:category/:subcategory", (_request, { params }) => {
	return {
		category: params?.category,
		subcategory: params?.subcategory,
	};
});

await start(router);
