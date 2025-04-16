import { createContext, type ReactElement, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { kyClient } from "../queryClient.ts";
import { type PrintFlowUser, USER_PERMISSIONS, type UserPermission } from "shared/browser";

const UserContext = createContext<PrintFlowUser | undefined>(undefined);
export const useUser = () => {
  return useContext(UserContext);
};
export const useUserPermissions = () => {
  const user = useUser();
  return USER_PERMISSIONS.reduce(
    (acc, permission) => {
      acc[permission] = user?.permissions?.includes(permission) ?? false;
      return acc;
    },
    {} as Record<UserPermission, boolean>,
  );
};

export const UserContextProvider = ({ children }: { children: string | ReactElement | ReactElement[] }) => {
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: () => kyClient("/api/user").json<PrintFlowUser>(),
  });

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};
