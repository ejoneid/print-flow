import {createRoot} from 'react-dom/client'
import * as reactRouterDom from "react-router-dom";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import './index.css'
import App from './App.tsx'
import SuperTokens, {SuperTokensWrapper} from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session, {SessionAuth} from "supertokens-auth-react/recipe/session";
import {EmailPasswordPreBuiltUI} from 'supertokens-auth-react/recipe/emailpassword/prebuiltui';
import {getSuperTokensRoutesForReactRouterDom} from "supertokens-auth-react/ui";
import ThirdParty, {Google} from "supertokens-auth-react/recipe/thirdparty";
import {ThirdPartyPreBuiltUI} from 'supertokens-auth-react/recipe/thirdparty/prebuiltui';
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "./queryClient.ts";
import {UserContextProvider} from "./hooks/useUser.tsx";

if (import.meta.env.VITE_OVERRIDE_AUTH !== "true") {
    SuperTokens.init({
        appInfo: {
            appName: "Print flow",
            apiDomain: import.meta.env.VITE_API_DOMAIN,
            websiteDomain: import.meta.env.VITE_WEBSITE_DOMAIN,
            apiBasePath: "/auth",
            websiteBasePath: "/login",
        },
        recipeList: [
            EmailPassword.init(),
            Session.init({
                override: {
                    functions: (originalImplementation) => {
                        return {
                            ...originalImplementation,
                            getUserId: async (context) => {
                                const storedUserUuid = localStorage.getItem("x-print-flow-user-uuid");
                                return storedUserUuid ?? "defaultTestUserUuid";
                            }
                        }
                    }
                }
            }),
            ThirdParty.init({
                signInAndUpFeature: {
                    providers: [
                        Google.init()
                    ],
                },
            })
        ],
    });
}

const AppWithAuth = () => (
    <SuperTokensWrapper>
        <QueryClientProvider client={queryClient} >
            <UserContextProvider>
                <BrowserRouter>
                    <Routes>
                        {getSuperTokensRoutesForReactRouterDom(reactRouterDom, [ThirdPartyPreBuiltUI, EmailPasswordPreBuiltUI])}
                        <Route path="/" element={<SessionAuth><App/></SessionAuth>}/>
                    </Routes>
                </BrowserRouter>
            </UserContextProvider>
        </QueryClientProvider>
    </SuperTokensWrapper>
);

const AppWithoutAuth = () => (
    <QueryClientProvider client={queryClient}>
        <UserContextProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App/>}/>
                </Routes>
            </BrowserRouter>
        </UserContextProvider>
    </QueryClientProvider>
);

const AppToRender = import.meta.env.VITE_OVERRIDE_AUTH === "true" ? <AppWithoutAuth /> : <AppWithAuth/>

createRoot(document.getElementById('root')!).render(AppToRender)
