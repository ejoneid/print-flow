import { createRoot } from "react-dom/client";
import * as reactRouterDom from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { HomePage } from "@/pages/Home.tsx";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session, { SessionAuth } from "supertokens-auth-react/recipe/session";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import ThirdParty, { Google } from "supertokens-auth-react/recipe/thirdparty";
import { ThirdPartyPreBuiltUI } from "supertokens-auth-react/recipe/thirdparty/prebuiltui";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient.ts";
import { UserContextProvider } from "./hooks/useUser.tsx";
import type { ReactNode } from "react";
import { RequestPage } from "@/pages/Request.tsx";

if (import.meta.env.VITE_OVERRIDE_AUTH !== "true") {
  SuperTokens.init({
    appInfo: {
      appName: "Print flow",
      apiDomain: window.location.origin,
      websiteDomain: window.location.origin,
      apiBasePath: "/auth",
      websiteBasePath: "/login",
    },
    recipeList: [
      EmailPassword.init(),
      Session.init(),
      ThirdParty.init({
        signInAndUpFeature: {
          providers: [Google.init()],
        },
      }),
    ],
  });
}

const ConditionalSuperTokensRoutes = () =>
  import.meta.env.VITE_OVERRIDE_AUTH === "true"
    ? null
    : getSuperTokensRoutesForReactRouterDom(reactRouterDom, [ThirdPartyPreBuiltUI, EmailPasswordPreBuiltUI]);

const ConditionalSuperTokensWrapper = ({ children }: { children: ReactNode }) =>
  import.meta.env.VITE_OVERRIDE_AUTH === "true" ? children : <SuperTokensWrapper>{children}</SuperTokensWrapper>;

const ConditionalSessionAuth = ({ children }: { children: ReactNode }) =>
  import.meta.env.VITE_OVERRIDE_AUTH === "true" ? children : <SessionAuth>{children}</SessionAuth>;

const Application = () => (
  <ConditionalSuperTokensWrapper>
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <BrowserRouter>
          <Routes>
            {ConditionalSuperTokensRoutes()}
            <Route
              path="/"
              element={
                <ConditionalSessionAuth>
                  <App />
                </ConditionalSessionAuth>
              }
            >
              <Route index element={<HomePage />} />
              <Route path="request" element={<RequestPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserContextProvider>
    </QueryClientProvider>
  </ConditionalSuperTokensWrapper>
);

// biome-ignore lint/style/noNonNullAssertion:
createRoot(document.getElementById("root")!).render(<Application />);
