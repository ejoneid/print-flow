import { LoadingScreen } from "@/components/LoadingScreen.tsx";
import { useQuery } from "@tanstack/react-query";
import { createContext, type ReactElement, useContext } from "react";
import { type PrintFlowUser, USER_PERMISSIONS, type UserPermission } from "shared/browser";
import { kyClient } from "../queryClient.ts";

const EMPTY_USER: PrintFlowUser = {
  userUuid: "" as UUID,
  email: "",
  fullName: "",
  avatar: undefined,
  permissions: [],
  roles: [],
};

const UserContext = createContext<PrintFlowUser>(EMPTY_USER);
export const useUser = () => {
  return useContext(UserContext)!;
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
  const { data, isPending } = useQuery({
    queryKey: ["self"],
    queryFn: () => kyClient("/api/self").json<PrintFlowUser>(),
  });

  if (isPending) return <LoadingScreen />;
  return <UserContext.Provider value={data ?? EMPTY_USER}>{children}</UserContext.Provider>;
};
