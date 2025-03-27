import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import Dashboard from "supertokens-node/recipe/dashboard";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import express from "express";
import cors from "cors";
import { errorHandler, middleware } from "supertokens-node/framework/express";
import onFinished from "on-finished";
import ThirdParty from "supertokens-node/recipe/thirdparty";

const port = 8000;

supertokens.init({
  framework: "express",
  supertokens: {
    connectionURI: process.env.SUPERTOKENS_CONNECTION_URI,
    apiKey: process.env.SUPERTOKENS_API_KEY,
  },
  appInfo: {
    appName: "Print flow",
    apiDomain: process.env.API_DOMAIN,
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
                  clientId: process.env.GOOGLE_CLIENT_ID,
                  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                  scope: ["https://www.googleapis.com/auth/userinfo.email"],
                },
              ],
            },
          },
        ],
      },
    }),
    Session.init({
      exposeAccessTokenToFrontendInCookieBasedAuth: true,
    }),
    Dashboard.init(),
  ],
});

const app = express();

app.use((req, res, next) => {
  const startTime = Date.now();

  // Store original methods
  const originalSend = res.send;
  const originalJson = res.json;
  let responseBody;

  res.send = function (body) {
    responseBody = body;
    return originalSend.call(this, body);
  };

  res.json = function (body) {
    responseBody = JSON.stringify(body);
    return originalJson.call(this, body);
  };

  onFinished(res, (err, res) => {
    const duration = Date.now() - startTime;
    console.log(
      `${req.method} ${req.url} - ${res.statusCode} - ${duration}ms - ${responseBody || "[No response body]"}`,
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

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
