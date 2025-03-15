import { serve } from "bun";

const port = 3001;

serve({
    port: port,
    serverName: "print-flow",
    routes: {
        "/api/status": new Response("OK"),
    },
});

console.log(`Server started on port ${port}`);
