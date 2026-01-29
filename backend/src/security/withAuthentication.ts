import type { RequestHandler } from "../utils/logginUtils.ts";
import JsonWebToken, { type JwtPayload, type VerifyErrors } from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { TEST_USERS } from "../user/testUsers.ts";
import { logger } from "shared/node";
import type { BunRequest } from "bun";
import { unauthorizedResponse } from "../utils/responses.ts";
import { USER_PERMISSIONS, USER_ROLES, type UserPermission, type UserRole } from "shared/browser";
import cookie from "cookie";
import { runWithRequestContext } from "./requestContext.ts";

export type AuthDetails = {
  userUuid: UUID;
  fullName: string;
  email: string;
  avatar: string | undefined;
  roles: Set<UserRole>;
  permissions: Set<UserPermission>;
};

const USER_UUID_HEADER = "x-print-flow-user-uuid";

export const withAuthentication = <TRequest extends BunRequest>(
  handler: RequestHandler<TRequest>,
): RequestHandler<TRequest> => {
  return async (req: TRequest): Promise<Response> => {
    if (process.env.ALLOW_AUTH_OVERRIDE === "true") {
      const overrideUserUuid = req.headers.get(USER_UUID_HEADER) as UUID | null;
      if (!overrideUserUuid) return unauthorizedResponse(`No ${USER_UUID_HEADER} header`);
      if (overrideUserUuid in TEST_USERS) {
        return runWithRequestContext({ authDetails: TEST_USERS[overrideUserUuid] }, () => handler(req));
      }
      return unauthorizedResponse(`No test user with uuid ${overrideUserUuid}`);
    }

    // TEMPORARY USING COOKIE LIBRARY WHILE Bun.CookieMap IS BROKEN
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = cookie.parse(cookieHeader);

    const jwt = cookies.sAccessToken;
    if (!jwt) return unauthorizedResponse("Missing sAccessToken in cookie");

    let error: VerifyErrors | undefined;
    JsonWebToken.verify(jwt, getKey, {}, (err) => {
      if (err) error = err;
    });

    if (error) {
      logger.warn(`Unauthorized: ${error.message}`);
      return new Response("Unauthorized", {
        status: 401,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

    const decodedJwt = JsonWebToken.decode(jwt) as JwtPayload;
    const authDetails: AuthDetails = {
      userUuid: decodedJwt.sub as UUID,
      fullName: decodedJwt.userData.fullName as string,
      email: decodedJwt.userData.email as string,
      avatar: decodedJwt.userData.avatar as string | undefined,
      roles: extractUserRoles(decodedJwt),
      permissions: extractUserPermissions(decodedJwt),
    };

    return runWithRequestContext({ authDetails }, () => handler(req));
  };
};

function extractUserRoles(decodedJwt: JwtPayload): Set<UserRole> {
  const result = new Set<UserRole>();
  if ("st-role" in decodedJwt) {
    for (const role of decodedJwt["st-role"].v as string[]) {
      if (isUserRole(role)) {
        result.add(role);
      }
    }
  }
  return result;
}

function extractUserPermissions(decodedJwt: JwtPayload): Set<UserPermission> {
  const result = new Set<UserPermission>();
  if ("st-perm" in decodedJwt) {
    for (const permission of decodedJwt["st-perm"].v as string[]) {
      if (isUserPermission(permission)) {
        result.add(permission);
      }
    }
  }
  return result;
}

function isUserRole(str: string): str is UserRole {
  return (USER_ROLES as readonly string[]).includes(str);
}

function isUserPermission(str: string): str is UserPermission {
  return (USER_PERMISSIONS as readonly string[]).includes(str);
}

const client = jwksClient({
  jwksUri: process.env.JWKS_URI!,
});

// @ts-expect-error
const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    // @ts-expect-error
    const signingKey = key?.publicKey ?? key?.rsaPublicKey;
    callback(null, signingKey);
  });
};
