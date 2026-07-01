"use client";

import React, { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider, ToastProvider } from "@repo/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system">
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
