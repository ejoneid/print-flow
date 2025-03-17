import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import express from "express";
import cors from "cors";
import {errorHandler, middleware} from "supertokens-node/framework/express";
import onFinished from 'on-finished';

const port = 8000;

supertokens.init({
    framework: "express",
    supertokens: {
        // We use try.supertokens for demo purposes.
        // At the end of the tutorial we will show you how to create
        // your own SuperTokens core instance and then update your config.
        connectionURI: "https://try.supertokens.io",
        // apiKey: <YOUR_API_KEY>
    },
    appInfo: {
        // learn more about this on https://supertokens.com/docs/session/appinfo
        appName: "Print flow",
        apiDomain: "http://localhost:8000",
        websiteDomain: "http://localhost:3000",
        apiBasePath: "/auth",
        websiteBasePath: "/auth",
    },
    recipeList: [
        EmailPassword.init(), // initializes signin / sign up features
        Session.init() // initializes session features
    ]
});

let app = express();

app.use((req, res, next) => {
    const startTime = Date.now();

    // Store original methods
    const originalSend = res.send;
    const originalJson = res.json;
    let responseBody;

    res.send = function(body) {
        responseBody = body;
        return originalSend.call(this, body);
    };

    res.json = function(body) {
        responseBody = JSON.stringify(body);
        return originalJson.call(this, body);
    };

    onFinished(res, (err, res) => {
        const duration = Date.now() - startTime;
        console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms - ${responseBody || '[No response body]'}`);
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