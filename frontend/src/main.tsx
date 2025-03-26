import {createRoot} from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import './index.css'
import App from './App.tsx'
import SuperTokens, {SuperTokensWrapper} from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session, {SessionAuth} from "supertokens-auth-react/recipe/session";
import {EmailPasswordPreBuiltUI} from 'supertokens-auth-react/recipe/emailpassword/prebuiltui';
import {getSuperTokensRoutesForReactRouterDom} from "supertokens-auth-react/ui";
import * as reactRouterDom from "react-router-dom";
import ThirdParty, {Google} from "supertokens-auth-react/recipe/thirdparty";
import {ThirdPartyPreBuiltUI} from 'supertokens-auth-react/recipe/thirdparty/prebuiltui';
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "./queryClient.ts";

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
        Session.init(),
        ThirdParty.init({
            signInAndUpFeature: {
                providers: [
                    Google.init()
                ],
            },
        })
    ],
});

createRoot(document.getElementById('root')!).render(
    <SuperTokensWrapper>
        <QueryClientProvider client={queryClient} >
            <BrowserRouter>
                <Routes>
                    {getSuperTokensRoutesForReactRouterDom(reactRouterDom, [ThirdPartyPreBuiltUI, EmailPasswordPreBuiltUI])}
                    <Route path="/" element={<SessionAuth><App/></SessionAuth>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    </SuperTokensWrapper>,
)
