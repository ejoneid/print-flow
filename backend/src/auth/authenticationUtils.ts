import type { RequestHandler } from "../utils/logginUtils.ts";
import JsonWebToken from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { TEST_USERS } from "./testUsers.ts";

const USER_ROLES = ["USER", "ADMIN"] as const;
const USER_PERMISSIONS = ["read", "write", "request_print", "approve_print"] as const;
export type UserRoles = (typeof USER_ROLES)[number];
export type UserPermissions = (typeof USER_PERMISSIONS)[number];

export type AuthDetails = {
  userUuid: UUID;
  roles: Set<UserRoles>;
  permissions: Set<UserPermissions>;
};

type AuthenticatedRequestHandler = (req: Request, authDetails: AuthDetails) => Response | Promise<Response>;

const USER_UUID_HEADER = "x-print-flow-user-uuid";

export const withAuthentication = (handler: AuthenticatedRequestHandler): RequestHandler => {
  return async (req: Request): Promise<Response> => {
    if (process.env.ALLOW_AUTH_OVERRIDE === "true") {
      const overrideUserUuid = req.headers.get(USER_UUID_HEADER);
      if (!overrideUserUuid) return Unauthorized(`No ${USER_UUID_HEADER} header`);
      if (overrideUserUuid in TEST_USERS) {
        return handler(req, TEST_USERS[overrideUserUuid]);
      }
      return Unauthorized(`No test user with uuid ${overrideUserUuid}`);
    }

    const cookieString = req.headers.get("cookie");
    if (!cookieString) return Unauthorized("No cookie header");

    const cookies = parseCookie(cookieString);
    const jwt = cookies.sAccessToken;

    // biome-ignore lint/suspicious/noImplicitAnyLet:
    let error;
    JsonWebToken.verify(jwt, getKey, {}, (err, decoded) => {
      if (err) error = err;
    });

    if (error) {
      console.error(error.message);
      return new Response("Unauthorized", {
        status: 401,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

    const decodedJwt = JsonWebToken.decode(jwt);
    const authDetails: AuthDetails = {
      userUuid: decodedJwt.sub as UUID,
      roles: extractUserRoles(decodedJwt),
      permissions: extractUserPermissions(decodedJwt),
    };

    return handler(req, authDetails);
  };
};

function extractUserRoles(decodedJwt: unknown | undefined | null): Set<UserRoles> {
  const result = new Set<UserRoles>();
  if ("st-role" in decodedJwt) {
    for (const role of decodedJwt["st-role"].v as string[]) {
      if (isUserRole(role)) {
        result.add(role);
      }
    }
  }
  return result;
}

function extractUserPermissions(decodedJwt: unknown | undefined | null): Set<UserPermissions> {
  const result = new Set<UserPermissions>();
  if ("st-perm" in decodedJwt) {
    for (const permission of decodedJwt["st-perm"].v as string[]) {
      if (isUserPermission(permission)) {
        result.add(permission);
      }
    }
  }
  return result;
}

function isUserRole(str: string): str is UserRoles {
  return USER_ROLES.includes(str);
}

function isUserPermission(str: string): str is UserPermissions {
  return USER_PERMISSIONS.includes(str);
}

export function Unauthorized(message: string) {
  console.log(message);
  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

export function Forbidden(message: string) {
  console.log(message);
  return new Response("Forbidden", {
    status: 403,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

const client = jwksClient({
  jwksUri: process.env.JWKS_URI,
});

const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
};

function parseCookie(str: string) {
  return str
    .split(";")
    .map((v) => v.split("="))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});
}
