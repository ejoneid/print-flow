import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import printFlowLogo from "/print_flow_logo.svg";
import "./App.css";
import { signOut } from "supertokens-auth-react/recipe/session";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { UserSwitcher } from "./components/UserSwitcher.tsx";
import { requestHeaders } from "./queryClient.ts";
import { useUser } from "./hooks/useUser.tsx";

function App() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  const user = useUser();
  const { data } = useQuery({
    queryKey: ["queue"],
    queryFn: () =>
      fetch("/api/print-queue", {
        headers: requestHeaders,
      }).then((res) => res.json()),
  });

  console.log(data);

  const logout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <>
      {!!user && (
        <>
          <p>
            Logged in as <b>{user.userUuid}</b>
          </p>
          <button type="button" onClick={logout}>
            Sign out
          </button>
        </>
      )}
      {import.meta.env.VITE_OVERRIDE_AUTH === "true" && <UserSwitcher />}
        <div>
            <img src={printFlowLogo} className="logo" alt="Print flow logo"/>
            <a href="https://vite.dev" target="_blank" rel="noreferrer">
                <img src={viteLogo} className="logo" alt="Vite logo"/>
            </a>
            <a href="https://react.dev" target="_blank" rel="noreferrer">
                <img src={reactLogo} className="logo react" alt="React logo"/>
            </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
            <button type="button" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
