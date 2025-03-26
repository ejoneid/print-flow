import type {RequestHandler} from "./logginUtils.ts";
import JsonWebToken from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

export const withAuthentication = (handler: RequestHandler): RequestHandler => {
    return async (req: Request): Promise<Response> => {
        const cookieString = req.headers.get("cookie");
        if (!cookieString) return Unauthorized("No cookie header");

        const cookies = parseCookie(cookieString);
        const jwt = cookies['sAccessToken'];

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

        return handler(req);
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
}

function parseCookie(str: string) {
    return str
        .split(';')
        .map(v => v.split('='))
        .reduce((acc, v) => {
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
            return acc;
        }, {});
}