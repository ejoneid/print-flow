import type { RequestHandler } from "./logginUtils.ts";
import JsonWebToken from "jsonwebtoken";
import jwksClient from "jwks-rsa";

export type AuthDetails = {
  userUuid: string;
};

type AuthenticatedRequestHandler = (req: Request, authDetails: AuthDetails) => Response | Promise<Response>;

export const withAuthentication = (handler: AuthenticatedRequestHandler): RequestHandler => {
  return async (req: Request): Promise<Response> => {
    if (process.env.ALLOW_AUTH_OVERRIDE === "true") {
      const overrideUserUuid = req.headers.get("x-user-uuid");
      if (!overrideUserUuid) return Unauthorized("No x-user-uuid header");
      return handler(req, { userUuid: overrideUserUuid });
    }

    const cookieString = req.headers.get("cookie");
    if (!cookieString) return Unauthorized("No cookie header");

    const cookies = parseCookie(cookieString);
    const jwt = cookies["sAccessToken"];

    var error;
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
      userUuid: decodedJwt.sub as string,
    };

    return handler(req, authDetails);
  };
};

function Unauthorized(message: string) {
  console.log(message);
  return new Response("Unauthorized", {
    status: 401,
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
