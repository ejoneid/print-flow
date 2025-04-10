import { createContext, type ReactElement, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { requestHeaders } from "../queryClient.ts";

type PrintFlowUser = {
  userUuid: string;
};

const UserContext = createContext<PrintFlowUser | null>(null);
export const useUser = () => {
  return useContext(UserContext);
};

export const UserContextProvider = ({ children }: { children: string | ReactElement | ReactElement[] }) => {
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      fetch("/api/user", {
        headers: requestHeaders,
      }).then((res) => res.json()),
  });
  console.log(data);

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};
