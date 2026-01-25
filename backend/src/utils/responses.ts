import { logger } from "shared/node";

export function unauthorizedResponse(message: string) {
  logger.warn(message);
  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

export function forbiddenResponse(message: string) {
  logger.warn(message);
  return new Response("Forbidden", {
    status: 403,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

export function notFoundResponse(message: string) {
  logger.warn(message);
  return new Response("Not found", {
    status: 404,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

export function badRequestResponse(message: string) {
  logger.warn(message);
  return new Response("Bad Request", {
    status: 400,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

export function internalServerErrorResponse(message: string) {
  logger.error(message);
  return new Response("Internal Server Error", {
    status: 500,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
