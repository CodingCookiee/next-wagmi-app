"use client";

import { useEffect } from "react";
import { ConnectKitProvider, } from "connectkit";
import { WagmiProvider, createConfig, useAccount } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultConfig } from "connectkit";
import { siweClient } from '../../utils/siweClient.js';
import { useRouter } from "next/navigation";

const chainId = parseInt(process.env.NEXT_CHAIN_ID || "11155111");
const activeChain = chainId === 1 ? mainnet : sepolia;

// Create the config
const config = createConfig(
  getDefaultConfig({
    chains: [activeChain],
    transports: {
      [mainnet.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
      ),
      [sepolia.id]: http(
        process.env.NEXT_RPC_URL || "https://eth-sepolia.public.blastapi.io"
      ),
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    appName: "NFT Nexus",
    appDescription: "NFT Nexus - Your NFT Dashboard & Marketplace",
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001", 
    appIcon: "/app/favicon.png",
  })
);

// Create a client
const queryClient = new QueryClient();

// Wrapper component to handle disconnection logic
function ConnectionMonitor() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    // Store the initial connection state
    const initiallyConnected = isConnected;
    
    // Check if this is a restricted route that requires authentication
    const isRestrictedRoute = () => {
      const pathname = window.location.pathname;
      return pathname.includes('/dashboard') || 
             pathname.includes('/contract-interactions') || 
             pathname.includes('/profile') ||
             pathname.includes('/marketplace');
    };

    // If we're on a restricted route and the wallet gets disconnected, redirect
    if (initiallyConnected && !isConnected && isRestrictedRoute()) {
      console.log("Wallet disconnected, redirecting to home page");
      router.push("/");
    }
  }, [isConnected, router]);

  return null;
}

export function ClientProviders({ children }) {
  const router = useRouter();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <siweClient.Provider
          enabled={true}
          nonceRefetchInterval={60000}
          sessionRefetchInterval={60000}
          signOutOnDisconnect={true}
          signOutOnAccountChange={true}
          signOutOnNetworkChange={true}
          onSignIn={(session) => {
            console.log("User signed in");
          }}
          onSignOut={() => {
            console.log("User signed out");
          }}
        >
          <ConnectKitProvider
            theme="rounded"
            mode="auto"
            options={{
              embedGoogleFonts: true,
              walletConnectName: 'WalletConnect',
              overlayBlur: 4,
              truncateLongENSAddress: true,
              walletConnectCTA: 'both',
              enableSIWE: true,
            }}
          >
            <ConnectionMonitor />
            {children}
          </ConnectKitProvider>
        </siweClient.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}