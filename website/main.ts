import { contentType, extname, serve } from "./deps.ts";

// TODO: replace with log module
const logger = console;

// set cwd for deno deploy
const cwd = Deno.cwd().includes("website")
  ? Deno.cwd()
  : `${Deno.cwd()}/website`;

const config = {
  pagesDir: `${cwd}/pages`,
  layoutFile: "_layout.html",
};

async function handler(request: Request): Promise<Response> {
  const { pathname, search } = new URL(request.url);

  // infer the content-type from the file extension
  const extension = extname(pathname);
  const type = contentType(extension) ?? "text/html";

  // response status
  let status = 200;

  // response headers
  let headers: Record<string, string> = {
    "content-type": type,
  };

  let content: string | null = null;

  try {
    // TODO: enable nested layouts
    const layout = await Deno.readTextFile(
      `${config.pagesDir}/${config.layoutFile}`,
    );

    // static assets
    if (pathname.startsWith("/public/")) {
      content = await Deno.readTextFile(`${cwd}/${pathname}`);
      headers = {
        ...headers,
        // TODO: fingerprint assets for longer cache TTL + immutable
        "cache-control": "public, max-age=900, stale-while-revalidate=900",
      };

      // early return to bypass template layout
      return new Response(content, {
        status,
        headers,
      });
    } // api (deno doc)
    else if (pathname.startsWith("/api")) {
      // parse module path from URL
      const mod = pathname.replace("/api", "");
      status = 307;
      headers = {
        ...headers,
        "location": `https://doc.deno.land/https://deno.land/x/atlas${mod}`,
      };
    } // docs
    else if (pathname === "/docs") {
      const versions = [];
      for await (
        const entry of Deno.readDir(`${config.pagesDir}/${pathname}`)
      ) {
        if (entry.isDirectory) {
          versions.push(entry);
        }
      }

      status = 307;
      headers = {
        ...headers,
        // redirect to latest version
        "location": `/docs/${versions.at(-1)?.name}`,
      };
    } // other routes
    else {
      // try /[route].html first
      try {
        content = await Deno.readTextFile(
          `${config.pagesDir}/${pathname}.html`,
        );
      } // fallback to `/[route]/index.html`
      catch (error: unknown) {
        if ((error as Error).name === "NotFound") {
          content = await Deno.readTextFile(
            `${config.pagesDir}/${pathname}/index.html`,
          );
        }
      }

      headers = {
        ...headers,
        "cache-control": "public, max-age=900, stale-while-revalidate=900",
      };
    }

    const payload = render(layout, {
      // layout "props" data from child pages
      title: content?.match(/<!-- title: (.*) -->/)?.at(1),
      meta_description: content?.match(/<!-- meta_description: (.*) -->/)?.at(
        1,
      ),
      content,
    });

    return new Response(payload, {
      status,
      headers,
    });
  } catch (error: unknown) {
    logger.error((error as Error).message);

    // 404
    if ((error as Error).name === "NotFound") {
      status = 404;
      content = await Deno.readTextFile(`${config.pagesDir}/404.html`);
    } // 500
    else {
      status = 500;
      content = await Deno.readTextFile(`${config.pagesDir}/500.html`);
    }

    const payload = render(content);

    return new Response(payload, {
      status,
      headers,
    });
  } finally {
    logger.info(`${status} ${request.method} ${pathname}${search}`);
  }
}

/**
 * Renders a template into a string to be sent as response
 * @param template The template string
 * @param props The properties to inject into the template
 */
function render(
  template: string | null,
  props: Record<string, string | number | null | undefined> = {},
): string | null {
  let rendered = template;

  if (rendered) {
    for (const key in props) {
      const value = props[key];

      if (!value) {
        continue;
      }

      if (Object.hasOwn(props, key)) {
        rendered = rendered.replace(`{{ ${key} }}`, value.toString());
      }
    }
  }

  return rendered;
}

await serve(handler, {
  onListen: ({ hostname, port }) => {
    logger.info(`Listening on http://${hostname}:${port}`);
  },
});
