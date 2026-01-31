import { HomePage } from "@/pages/Home.tsx";
import { ProfilePage } from "@/pages/Profile.tsx";
import { RequestPage } from "@/pages/Request.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import * as reactRouterDom from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import Session, { SessionAuth } from "supertokens-auth-react/recipe/session";
import ThirdParty, { Google } from "supertokens-auth-react/recipe/thirdparty";
import { ThirdPartyPreBuiltUI } from "supertokens-auth-react/recipe/thirdparty/prebuiltui";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import App from "./App.tsx";
import { ThemeProvider } from "./components/ThemeProvider.tsx";
import { UserContextProvider } from "./hooks/useUser.tsx";
import "./index.css";
import AdminPage from "./pages/Admin.tsx";
import { queryClient } from "./queryClient.ts";

if (process.env.FRONTEND_OVERRIDE_AUTH !== "true") {
  SuperTokens.init({
    appInfo: {
      appName: "Print flow",
      apiDomain: window.location.origin,
      websiteDomain: window.location.origin,
      apiBasePath: "/auth",
      websiteBasePath: "/login",
    },
    recipeList: [
      EmailPassword.init({
        signInAndUpFeature: {
          signUpForm: {
            formFields: [
              {
                id: "fullName",
                label: "Full name",
                placeholder: "First name and last name",
              },
            ],
          },
        },
      }),
      Session.init({
        onHandleEvent: (context) => {
          if (context.action === "SESSION_CREATED") {
            // Invalidate the "self" query to refresh user data after login
            queryClient.invalidateQueries({ queryKey: ["self"] });
          }
        },
      }),
      ThirdParty.init({
        signInAndUpFeature: {
          providers: [Google.init()],
        },
      }),
    ],
  });
}

const ConditionalSuperTokensRoutes = () =>
  process.env.FRONTEND_OVERRIDE_AUTH === "true"
    ? null
    : getSuperTokensRoutesForReactRouterDom(reactRouterDom, [ThirdPartyPreBuiltUI, EmailPasswordPreBuiltUI]);

const ConditionalSuperTokensWrapper = ({ children }: { children: ReactNode }) =>
  process.env.FRONTEND_OVERRIDE_AUTH === "true" ? children : <SuperTokensWrapper>{children}</SuperTokensWrapper>;

const ConditionalSessionAuth = ({ children }: { children: ReactNode }) =>
  process.env.FRONTEND_OVERRIDE_AUTH === "true" ? children : <SessionAuth>{children}</SessionAuth>;

const Application = () => (
  <ConditionalSuperTokensWrapper>
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <ThemeProvider>
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
                <Route path="admin" element={<AdminPage />} />
                <Route path="profile/:userUuid" element={<ProfilePage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </UserContextProvider>
    </QueryClientProvider>
  </ConditionalSuperTokensWrapper>
);

createRoot(document.getElementById("root")!).render(<Application />);
