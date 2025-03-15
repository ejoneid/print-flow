import {serve} from "bun";
import {getPrintQueue, postPrintQueue} from "./src/routes/print-queue.ts";
import {withLogging} from "./utils/logginUtils.ts";
import {getMigrations, migrate} from "bun-sqlite-migrations";
import {db} from "./src/db.ts";

const port = 3001;

migrate(db, getMigrations("./migrations"));

serve({
    port: port,
    routes: {
        "/api/status": {
            GET: () => new Response("OK"),
        },
        "/api/print-queue": {
            GET: withLogging(getPrintQueue),
            POST: withLogging(postPrintQueue),
        },
    },
    fetch: withLogging((req) =>
        new Response("Not found", {
            status: 404,
            headers: {
                "Content-Type": "text/plain",
            },
        })
    ),
    error(error) {
        console.error(error);
        return new Response(`Internal Error: ${error.message}`, {
            status: 500,
            headers: {
                "Content-Type": "text/plain",
            },
        });
    },
});

console.log(`Server started on port ${port}`);
