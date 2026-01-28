import { AsyncLocalStorage } from "node:async_hooks";
import type { AuthDetails } from "./withAuthentication";

export type RequestContext = {
  authDetails?: AuthDetails;
};

const als = new AsyncLocalStorage<RequestContext>();

export function runWithRequestContext<T>(ctx: RequestContext, fn: () => T): T {
  return als.run(ctx, fn);
}

export function getRequestContext(): RequestContext {
  return als.getStore() ?? {};
}

export function getAuthDetails(): AuthDetails {
  const auth = als.getStore()?.authDetails;
  if (!auth) throw new Error("AuthDetails missing from request context");
  return auth;
}
