import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@repo/backend/router";
import { QueryClient } from "@tanstack/react-query";
import {
  createTRPCClient,
  httpBatchLink,
  httpSubscriptionLink,
  splitLink,
} from "@trpc/client";
import { getSession } from "./auth";

export const queryClient = new QueryClient();

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      // SSE subscriptions go over httpSubscriptionLink, everything else is
      // batched over normal HTTP.
      condition: (op) => op.type === "subscription",
      true: httpSubscriptionLink({
        url: "http://localhost:8000/trpc",
      }),
      false: httpBatchLink({
        url: "http://localhost:8000/trpc",
        headers: () => {
          const token = getSession()?.token;
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
      }),
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});