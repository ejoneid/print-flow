import cors from "cors";
import express from "express";
import onFinished from "on-finished";
import supertokens from "supertokens-node";
import { errorHandler, middleware } from "supertokens-node/framework/express";
import Dashboard from "supertokens-node/recipe/dashboard";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import ThirdParty from "supertokens-node/recipe/thirdparty";
import UserRoles from "supertokens-node/recipe/userroles";
import { logger } from "shared/node";
import { initUserRoles } from "./src/roles.ts";

const port = process.env.PORT ?? 8000;

supertokens.init({
  framework: "express",
  supertokens: {
    // biome-ignore lint/suspicious/noExtraNonNullAssertion: <explanation>
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    connectionURI: process.env.SUPERTOKENS_CONNECTION_URI!!,
    apiKey: process.env.SUPERTOKENS_API_KEY,
  },
  appInfo: {
    appName: "Print flow",
    // biome-ignore lint/suspicious/noExtraNonNullAssertion: <explanation>
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    apiDomain: process.env.API_DOMAIN!!,
    websiteDomain: process.env.WEBSITE_DOMAIN,
    apiBasePath: "/auth",
    websiteBasePath: "/login",
  },
  recipeList: [
    EmailPassword.init(),
    ThirdParty.init({
      signInAndUpFeature: {
        providers: [
          {
            config: {
              thirdPartyId: "google",
              clients: [
                {
                  // biome-ignore lint/suspicious/noExtraNonNullAssertion: <explanation>
                  // biome-ignore lint/style/noNonNullAssertion: <explanation>
                  clientId: process.env.GOOGLE_CLIENT_ID!!,
                  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                  scope: ["https://www.googleapis.com/auth/userinfo.email"],
                },
              ],
            },
          },
        ],
      },
    }),
    Session.init(),
    UserRoles.init(),
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
  // @ts-ignore
  // biome-ignore lint/suspicious/noImplicitAnyLet:
  let responseBody;

  res.send = function (body) {
    responseBody = body;
    return originalSend.call(this, body);
  };

  res.json = function (body) {
    responseBody = JSON.stringify(body);
    return originalJson.call(this, body);
  };

  // @ts-ignore
  onFinished(res, (err, res) => {
    const duration = Date.now() - startTime;
    logger.info(
      // @ts-ignore
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
app.use(middleware());
app.use(errorHandler());

app.listen(port, async () => {
  await initUserRoles();
  console.log(`Listening on port ${port}...`);
});
