import { Router, start } from "../../mod.ts";

const router = new Router();

router.get("/", () => {
	return { message: "A GET handler" };
});

router.post("/", () => {
	return { message: "A POST handler" };
});

router.get("/:id", (_request, { params: { id } }) => {
	return { id };
});

router.get(
	"/:category/:subcategory",
	(_request, { params: { category, subcategory } }) => {
		return { category, subcategory };
	},
);

await start(router);
