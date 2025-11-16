import { keepPreviousData, QueryCache, QueryClient } from "@tanstack/react-query";
import ky, { type KyRequest } from "ky";
import { selectedUserUuid } from "@/components/UserSwitcher.tsx";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 1,
    },
  },
  queryCache: new QueryCache(),
});

export const USER_UUID_HEADER = "x-print-flow-user-uuid";

export const kyClient = ky.create({
  hooks: {
    beforeRequest: [
      (request: KyRequest) => {
        request.headers.set(USER_UUID_HEADER, selectedUserUuid);
      },
    ],
  },
});
