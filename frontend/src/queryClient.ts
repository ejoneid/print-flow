import { keepPreviousData, QueryCache, QueryClient } from "@tanstack/react-query";
import ky, { type KyRequest } from "ky";
import { getSelectedUserUuid } from "@/components/UserSwitcher.tsx";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 1,
      retry: false,
    },
  },
  queryCache: new QueryCache(),
});

export const USER_UUID_HEADER = "x-print-flow-user-uuid";

export const kyClient = ky.create({
  hooks: {
    beforeRequest:
      process.env.FRONTEND_OVERRIDE_AUTH === "true"
        ? [
            (request: KyRequest) => {
              request.headers.set(USER_UUID_HEADER, getSelectedUserUuid());
            },
          ]
        : undefined,
  },
});
