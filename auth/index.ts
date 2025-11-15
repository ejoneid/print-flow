import cors from "cors";
import express from "express";
import onFinished from "on-finished";
import supertokens, { getUser, type RecipeUserId, type User } from "supertokens-node";
import { errorHandler, middleware } from "supertokens-node/framework/express";
import Dashboard from "supertokens-node/recipe/dashboard";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import ThirdParty from "supertokens-node/recipe/thirdparty";
import UserRoles from "supertokens-node/recipe/userroles";
import UserMetadata, { getUserMetadata } from "supertokens-node/recipe/usermetadata";
import { logger } from "shared/node";
import { initUserRoles } from "./src/roles.ts";
import type { SessionContainerInterface } from "supertokens-node/lib/build/recipe/session/types";
import type { UserContext } from "supertokens-node/lib/build/types";

const port = process.env.PORT ?? 8000;

supertokens.init({
  framework: "express",
  debug: process.env.AUTH_DEBUG === "true",
  supertokens: {
    connectionURI: process.env.SUPERTOKENS_CONNECTION_URI!,
    apiKey: process.env.SUPERTOKENS_API_KEY,
  },
  appInfo: {
    appName: "Print flow",
    apiDomain: process.env.API_DOMAIN!,
    websiteDomain: process.env.WEBSITE_DOMAIN,
    apiBasePath: "/auth",
    websiteBasePath: "/login",
  },
  recipeList: [
    EmailPassword.init({
      signUpFeature: {
        formFields: [{ id: "fullName", optional: false }],
      },
      override: {
        apis: (originalImplementation) => ({
          ...originalImplementation,
          signUpPOST: async (input) => {
            if (originalImplementation.signUpPOST === undefined) {
              throw Error("Should never come here");
            }
            const response = await originalImplementation.signUpPOST(input);

            if (response.status === "OK") {
              const fullName = input.formFields.find((field) => field.id === "fullName")?.value;
              if (!fullName || typeof fullName !== "string") throw Error('Invalid value for "fullName"');
              await UserMetadata.updateUserMetadata(response.user.id, {
                fullName,
              });
            }
            return response;
          },
        }),
      },
    }),
    ThirdParty.init({
      signInAndUpFeature: {
        providers: [
          {
            config: {
              thirdPartyId: "google",
              clients: [
                {
                  clientId: process.env.GOOGLE_CLIENT_ID!,
                  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                  scope: [
                    "https://www.googleapis.com/auth/userinfo.email",
                    "https://www.googleapis.com/auth/userinfo.profile",
                  ],
                },
              ],
            },
          },
        ],
      },
      override: {
        functions: (originalImplementation) => ({
          ...originalImplementation,
          signInUp: async (input: {
            thirdPartyId: string;
            thirdPartyUserId: string;
            email: string;
            isVerified: boolean;
            // biome-ignore lint/suspicious/noExplicitAny: no explanation
            oAuthTokens: { [p: string]: any };
            rawUserInfoFromProvider: {
              // biome-ignore lint/suspicious/noExplicitAny: no explanation
              fromIdTokenPayload?: { [p: string]: any };
              // biome-ignore lint/suspicious/noExplicitAny: no explanation
              fromUserInfoAPI?: { [p: string]: any };
            };
            session: SessionContainerInterface | undefined;
            shouldTryLinkingWithSessionUser: boolean | undefined;
            tenantId: string;
            userContext: UserContext;
          }): Promise<
            | {
                status: "OK";
                createdNewRecipeUser: boolean;
                recipeUserId: RecipeUserId;
                user: User;
                // biome-ignore lint/suspicious/noExplicitAny: no explanation
                oAuthTokens: { [p: string]: any };
                rawUserInfoFromProvider: {
                  // biome-ignore lint/suspicious/noExplicitAny: no explanation
                  fromIdTokenPayload?: { [p: string]: any };
                  // biome-ignore lint/suspicious/noExplicitAny: no explanation
                  fromUserInfoAPI?: { [p: string]: any };
                };
              }
            | { status: "SIGN_IN_UP_NOT_ALLOWED"; reason: string }
            | {
                status: "LINKING_TO_SESSION_USER_FAILED";
                reason:
                  | "EMAIL_VERIFICATION_REQUIRED"
                  | "RECIPE_USER_ID_ALREADY_LINKED_WITH_ANOTHER_PRIMARY_USER_ID_ERROR"
                  | "ACCOUNT_INFO_ALREADY_ASSOCIATED_WITH_ANOTHER_PRIMARY_USER_ID_ERROR"
                  | "SESSION_USER_ACCOUNT_INFO_ALREADY_ASSOCIATED_WITH_ANOTHER_PRIMARY_USER_ID_ERROR";
              }
          > => {
            const response = await originalImplementation.signInUp(input);

            if (response.status === "OK" && input.thirdPartyId === "google") {
              try {
                const googleResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
                  headers: {
                    Authorization: `Bearer ${input.oAuthTokens.access_token}`,
                  },
                }).then((res) => res.json());

                await UserMetadata.updateUserMetadata(response.user.id, {
                  fullName: googleResponse.name as string,
                  avatar: googleResponse.picture as string | undefined,
                });
              } catch (err) {
                console.error("Error fetching additional user data:", err);
              }
            }

            return response;
          },
        }),
      },
    }),
    Session.init({
      override: {
        functions: (originalImplementation) => ({
          ...originalImplementation,
          createNewSession: async (input: {
            userId: string;
            recipeUserId: RecipeUserId;
            // biome-ignore lint/suspicious/noExplicitAny: no explanation
            accessTokenPayload?: any;
            // biome-ignore lint/suspicious/noExplicitAny: no explanation
            sessionDataInDatabase?: any;
            disableAntiCsrf?: boolean;
            tenantId: string;
            userContext: UserContext;
          }): Promise<SessionContainerInterface> => {
            const user = await getUser(input.userId);
            const userData = await getUserMetadata(input.userId);

            input.accessTokenPayload = {
              ...input.accessTokenPayload,
              userData: userData
                ? {
                    fullName: userData.metadata.fullName,
                    email: user?.emails[0],
                    avatar: userData.metadata.avatar,
                  }
                : null,
            };

            return originalImplementation.createNewSession(input);
          },
        }),
      },
    }),
    UserRoles.init(),
    UserMetadata.init(),
    Dashboard.init(),
  ],
});

const app = express();

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - Resolving...`);
  const startTime = Date.now();

  // Store original methods
  const originalSend = res.send;
  const originalJson = res.json;
  // @ts-expect-error
  // biome-ignore lint/suspicious/noImplicitAnyLet: no explanation
  let responseBody;

  res.send = function (body) {
    responseBody = body;
    return originalSend.call(this, body);
  };

  res.json = function (body) {
    responseBody = JSON.stringify(body);
    return originalJson.call(this, body);
  };

  onFinished(res, (_, res) => {
    const duration = Date.now() - startTime;
    logger.info(
      // @ts-expect-error
      `${req.method} ${req.url} - ${res.statusCode} - ${duration}ms - ${responseBody ?? "[No response body.status]"}`,
    );
  });

  next();
});

app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
  }),
);
// @ts-expect-error
app.use(middleware());
// @ts-expect-error
app.use(errorHandler());

app.listen(port, async () => {
  await initUserRoles();
  console.log(`Listening on port ${port}...`);
});
