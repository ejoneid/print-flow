import { serve } from "bun";
import frontend from "./index.html";

function proxyRequest(request: Bun.BunRequest, port: number) {
  const url = new URL(request.url);
  const targetUrl = new URL(url.pathname + url.search, `http://localhost:${port}`);
  return fetch(targetUrl, request);
}

const developmentServer = serve({
  routes: {
    "/*": frontend,
    "/api/*": (request) => proxyRequest(request, 3001),
    "/auth/*": (request) => proxyRequest(request, 8000),
  },
  development: true,
});

console.log(`Serving frontend on ${developmentServer.url}`);
