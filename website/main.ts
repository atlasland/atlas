import { contentType, extname, serve } from "./deps.ts";

// TODO: replace with log module
const logger = console;

// set cwd for deno deploy
const cwd = Deno.cwd().includes("website")
  ? Deno.cwd()
  : `${Deno.cwd()}/website`;

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

  // response body
  let body: string | null = null;

  try {
    // static assets
    if (pathname.startsWith("/public/")) {
      body = await Deno.readTextFile(`${cwd}/${pathname}`);
      headers = {
        ...headers,
        // TODO: fingerprint assets for longer cache TTL + immutable
        "cache-control": "public, max-age=900, stale-while-revalidate=900",
      };
      // early return to bypass template layout
      return new Response(body, { status, headers });
    } // home
    else if (["/", "/index.html"].includes(pathname)) {
      body = await Deno.readTextFile(`${cwd}/index.html`);
      headers = {
        ...headers,
        "cache-control": "public, max-age=900, stale-while-revalidate=900",
      };
    } // docs
    else if (["/docs", "/documentation"].includes(pathname)) {
      status = 307;
      headers = {
        ...headers,
        "location": "https://doc.deno.land/https://deno.land/x/atlas",
      };
    } // other routes
    else {
      try {
        body = await Deno.readTextFile(`${cwd}/${pathname}.html`);
      } // fallback to `/[route]/index.html`
      catch (_) {
        body = await Deno.readTextFile(`${cwd}/${pathname}/index.html`);
      }

      headers = {
        ...headers,
        "cache-control": "public, max-age=900, stale-while-revalidate=900",
      };
    }
  } catch (error: unknown) {
    logger.error((error as Error).message);

    // 404
    if ((error as Error).name === "NotFound") {
      status = 404;
      body = await Deno.readTextFile(`${cwd}/404.html`);
    } // 500
    else {
      status = 500;
      body = await Deno.readTextFile(`${cwd}/500.html`);
    }
  } finally {
    logger.info(`${status} ${request.method} ${pathname}${search}`);

    const template = await Deno.readTextFile(`${cwd}/template.html`);

    // parse meta data
    const title = body?.match(/<!-- title: (.*) -->/);
    const meta_description = body?.match(/<!-- meta_description: (.*) -->/);

    // inject meta data into template
    const payload = template
      .replaceAll("{{ title }}", title?.at(1) ?? "{{ title }}")
      .replaceAll(
        "{{ meta_description }}",
        meta_description?.at(1) ?? "{{ meta_description }}",
      )
      .replaceAll("{{ content }}", body ?? "");

    // deno-lint-ignore no-unsafe-finally
    return new Response(payload, {
      status,
      headers,
    });
  }
}

await serve(handler, {
  onListen: ({ hostname, port }) => {
    logger.info(`Listening on http://${hostname}:${port}`);
  },
});
