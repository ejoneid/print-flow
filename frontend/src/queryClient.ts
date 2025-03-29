import { keepPreviousData, QueryCache, QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      placeholderData: keepPreviousData,
    },
  },
  queryCache: new QueryCache(),
});

export const USER_UUID_HEADER = "x-print-flow-user-uuid";
export const requestHeaders = new Headers();
