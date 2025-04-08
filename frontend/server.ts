import { serve } from "bun";
import { logger } from "shared/node";

serve({
  port: 80,
  async fetch(req) {
    const requestPath = new URL(req.url).pathname;
    logger.info(`Serving "${requestPath}"`);
    const filePath = `dist${requestPath}`;
    const file = Bun.file(filePath);
    if (await file.exists()) {
      return new Response(file, {
        headers: {
          "Content-Type": file.type,
        },
      });
    }
    return new Response(Bun.file("dist/index.html"), {
      headers: {
        "Content-Type": "text/html",
      },
    });
  },
});

console.log("Server running on port 80");
