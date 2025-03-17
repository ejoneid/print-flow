import {createRoot} from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import './index.css'
import App from './App.tsx'
import SuperTokens, {SuperTokensWrapper} from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";
import { EmailPasswordPreBuiltUI } from 'supertokens-auth-react/recipe/emailpassword/prebuiltui';
import {getSuperTokensRoutesForReactRouterDom} from "supertokens-auth-react/ui";
import * as reactRouterDom from "react-router-dom";

SuperTokens.init({
    appInfo: {
        // learn more about this on https://supertokens.com/docs/references/frontend-sdks/reference#sdk-configuration
        appName: "Print flow",
        apiDomain: "http://localhost:8000",
        websiteDomain: "http://localhost:3000",
        apiBasePath: "/auth",
        websiteBasePath: "/auth",
    },
    recipeList: [EmailPassword.init(), Session.init()],
});

createRoot(document.getElementById('root')!).render(
  <SuperTokensWrapper>
    <BrowserRouter>
      <Routes>
          {getSuperTokensRoutesForReactRouterDom(reactRouterDom, [EmailPasswordPreBuiltUI])}
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  </SuperTokensWrapper>,
)
