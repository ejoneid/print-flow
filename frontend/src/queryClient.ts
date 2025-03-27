import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const USER_UUID_HEADER = "x-print-flow-user-uuid";
export const requestHeaders = new Headers();
