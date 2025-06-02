"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { config, defaultChain } from "../../utils/config.js";
import { SessionProvider } from "next-auth/react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
      onError: (error) => {
        console.error("Mutation error:", error);
      }
    }
  },
});

export function Web3Providers({ children }) {
  return (
    <WagmiProvider config={config}>
      <SessionProvider 
        refetchInterval={0}
        refetchOnWindowFocus={false}
      >
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            modalSize="compact"
            initialChain={defaultChain}
            showRecentTransactions={true}
          >
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </SessionProvider>
    </WagmiProvider>
  );
}
