import { walk } from "https://deno.land/std@0.149.0/fs/walk.ts";
import { serve, serveFile, Status, STATUS_TEXT } from "./deps.ts";

// TODO: replace with log module
const logger = console;

// set cwd for deno deploy
const cwd = Deno.cwd().includes("website")
	? Deno.cwd()
	: `${Deno.cwd()}/website`;

const config = {
	pages: {
		dir: `pages`,
		layout: "_layout.html",
		"404": "_404.html",
		"500": "_500.html",
		// global props and regexes to parse them from a page's content
		props: {
			title: /<!-- title: (.*) -->/,
			meta_description: /<!-- meta_description: (.*) -->/,
			canonical: /<!-- canonical: (.*) -->/,
			og_type: /<!-- og_type: (.*) -->/,
			og_image: /<!-- og_image: (.*) -->/,
		},
	},
	assets: {
		dir: `public`,
	},
};

async function handler(request: Request): Promise<Response> {
	const { url, method } = request;
	const { pathname, search } = new URL(url);
	const metadata: Record<string, unknown> = {
		pathname,
		search,
	};

	logger.debug();
	logger.debug(" === request start ===");

	let status = Status.OK;
	const headers = new Headers({
		"content-type": "text/html",
	});
	let content: string | null = null;

	try {
		// static assets
		if (pathname.startsWith(`/${config.assets.dir}/`)) {
			const response = await serveFile(
				request,
				`${cwd}/${config.assets.dir}${pathname}`,
			);
			// TODO: fingerprint assets for longer cache TTL + immutable
			response.headers.set(
				"cache-control",
				"public, max-age=900, stale-while-revalidate=900",
			);
			return response;
		} // api (deno doc)
		else if (pathname.startsWith("/api")) {
			status = Status.TemporaryRedirect;
			headers.set(
				"location",
				`https://doc.deno.land/https://deno.land/x/atlas${
					pathname.replace("/api", "")
				}`,
			);
		} // docs
		else if (pathname === "/docs") {
			const versions = [];
			for await (
				const entry of Deno.readDir(`${cwd}/${config.pages.dir}${pathname}`)
			) {
				if (entry.isDirectory) {
					// TODO: expose all versions to frontend for a dropdown selector
					versions.push(entry);
				}
			}

			// redirect to docs for latest version
			status = Status.TemporaryRedirect;
			headers.set("location", `/docs/${versions.at(-1)?.name}`);
		} // other routes
		else {
			content = await readResolvedFile(pathname);
			headers.set(
				"cache-control",
				"public, max-age=900, stale-while-revalidate=900",
			);
		}

		const layout = await buildLayout(`${cwd}/${config.pages.dir}${pathname}`);
		const payload = render(layout, {
			// "props" data from child pages
			...parseProps(content ?? "", config.pages.props),
			content,
		});

		return new Response(payload, {
			status,
			statusText: STATUS_TEXT[status],
			headers,
		});
	} catch (error: unknown) {
		logger.error((error as Error).message);
		metadata.error = (error as Error).message;

		// 404
		if ((error as Error).name === "NotFound") {
			status = Status.NotFound;
			content = await readResolvedFile(
				`${cwd}/${config.pages.dir}`,
				config.pages["404"],
			);
		} // 500
		else {
			status = Status.InternalServerError;
			content = await readResolvedFile(
				`${cwd}/${config.pages.dir}`,
				config.pages["500"],
			);
		}

		// layout for error pages should be the root layout
		const layout = await buildLayout(`${cwd}/${config.pages.dir}`);
		const payload = render(layout, {
			...parseProps(content, config.pages.props),
			content,
		});

		return new Response(payload, {
			status,
			statusText: STATUS_TEXT[status],
			headers,
		});
	} finally {
		logger.info({ status, method, ...metadata });
		logger.debug(" === request end ===");
	}
}

/**
 * Renders a template into a string to be sent as response
 * @param template The template string
 * @param props The properties to inject into the layout
 */
function render(
	template: string,
	props: Record<string, string | number | null | undefined> = {},
): string {
	let rendered = template;

	if (rendered) {
		for (const key in props) {
			const value = props[key];

			if (!value) {
				continue;
			}

			if (Object.hasOwn(props, key)) {
				rendered = rendered.replaceAll(`{{ ${key} }}`, value.toString());
			}
		}
	}

	return rendered;
}

function parseProps<T>(
	content: string | null,
	props: Record<keyof T, RegExp>,
): Record<keyof T, string> | null {
	if (content === null) {
		return content;
	}

	// @ts-ignore: not sure how to type this tbh
	let parsed: Record<keyof T, string> = {};

	for (const key in props) {
		if (Object.hasOwn(props, key)) {
			// parse the actual value using the RegExp provided
			const value = content?.match(props[key])?.at(1);

			if (!value) {
				continue;
			}

			parsed = {
				...parsed,
				[key]: value,
			};
		}
	}

	return parsed;
}

async function readResolvedFile(
	pathname: string,
	filename = "index",
): Promise<string | null> {
	let content: string | null = null;
	const path = pathname === "/" ? "" : pathname;

	try {
		// try /[pathname].html first
		content = await Deno.readTextFile(
			`${cwd}/${config.pages.dir}${path}.html`,
		);
		logger.debug(`file:`, `${cwd}/${config.pages.dir}${path}.html`);
	} // fallback to `/[pathname]/[filename].html`
	catch (error: unknown) {
		if ((error as Error).name === "NotFound") {
			content = await Deno.readTextFile(
				`${cwd}/${config.pages.dir}${path}/${filename}.html`,
			);
			logger.debug(
				`file:`,
				`${cwd}/${config.pages.dir}${path}/${filename}.html`,
			);
		}
	}

	return content;
}

async function buildLayout(
	path = `${cwd}/${config.pages.dir}`,
	{
		root,
		layout,
	} = {
		root: `${cwd}/${config.pages.dir}`,
		layout: config.pages.layout,
	},
): Promise<string> {
	const stack = [];

	console.debug("walk:", "┌", root);

	for await (
		const entry of walk(root, {
			includeDirs: false,
			match: [new RegExp(`${layout}$`)],
		})
	) {
		console.debug("walk:", "├─", entry.path);
		stack.push(entry.path);
	}

	return path;
}

await serve(handler);
