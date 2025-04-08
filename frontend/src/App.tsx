import printFlowLogo from "/print_flow_logo.svg";
import { useQuery } from "@tanstack/react-query";
import { UserSwitcher } from "./components/UserSwitcher.tsx";
import { requestHeaders } from "./queryClient.ts";
import { UserMenu } from "@/components/UserMenu.tsx";
import { Outlet } from "react-router-dom";

function App() {
  const { data } = useQuery({
    queryKey: ["queue"],
    queryFn: () =>
      fetch("/api/print-queue", {
        headers: requestHeaders,
      }).then((res) => res.json()),
  });

  console.log(data);

  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <img src={printFlowLogo} className="h-20" alt="Print flow logo" />
            <h1 className="lg:text-5xl text-3xl font-bold mb-2">Print Flow</h1>
          </div>
          <span className="mr-1">
            {import.meta.env.VITE_OVERRIDE_AUTH === "true" ? <UserSwitcher /> : <UserMenu />}
          </span>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
