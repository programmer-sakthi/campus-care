import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@repo/backend/router";
import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

export const queryClient = new QueryClient();

const trpcClient = createTRPCClient<AppRouter>({
  links: [httpBatchLink({
    url: "http://localhost:8000/trpc",
    headers: () => {
      const token = typeof window === "undefined" ? null : JSON.parse(localStorage.getItem("campus-care.session") ?? "null")?.token;
      return token ? { Authorization: `Bearer ${token}` } : {};
    },
  })],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
