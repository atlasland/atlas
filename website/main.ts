import { contentType, extname, serve } from "./deps.ts";

const cwd = Deno.cwd().includes("website")
  ? Deno.cwd()
  : `${Deno.cwd()}/website`;

async function handler(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);

  // infer the content-type from the file extension
  const extension = extname(pathname);
  const type = contentType(extension) ?? "text/html";

  try {
    let file = await Deno.readTextFile(`${cwd}/index.html`);

    // static assets
    if (pathname.startsWith("/public/")) {
      file = await Deno.readTextFile(`${cwd}/public${pathname}`);
    }

    console.info(200, `${request.method} ${pathname} (${type})`);

    return new Response(file, {
      headers: {
        "content-type": type,
        // 15 minutes cache TTL
        "cache-control": "public, max-age=900, stale-while-revalidate=900",
      },
    });
  } catch (error: unknown) {
    console.info(404, `${request.method} ${pathname} (${type})`);
    console.error((error as Error).message);

    return new Response(null, {
      status: 404,
      headers: {
        "content-type": type,
      },
    });
  }
}

await serve(handler);
