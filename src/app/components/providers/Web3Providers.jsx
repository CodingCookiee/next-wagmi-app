"use client";

import { ConnectKitProvider } from "connectkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { siweClient } from "../../utils/siweClient.js";
import { config } from "../../utils/config.js";
import { useEffect } from "react";
// import { isMobile } from "../../utils/walletHelpers.js";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function Web3Providers({ children }) {
  // // Handle mobile deep linking
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     // Check if we're coming back from a mobile redirect
  //     const urlParams = new URLSearchParams(window.location.search);
  //     const redirectAfterAuth = urlParams.get("redirectAfterAuth");

  //     if (redirectAfterAuth) {
  //       // Mark that we need to try session recovery
  //       if (!sessionStorage.getItem("recovering_session")) {
  //         sessionStorage.setItem("recovering_session", "true");
  //         // Force a refresh of the session
  //         queryClient.invalidateQueries({ queryKey: ["siwe"] });
  //       }
  //     } else {
  //       // Clear the recovery flag if not needed
  //       sessionStorage.removeItem("recovering_session");
  //     }
      
  //     // Apply monkey patch for mobile wallet deep linking if on mobile
  //     if (isMobile()) {
  //       // Add event listener for transaction requests
  //       window.addEventListener('wagmi:write', (event) => {
  //         console.log("Transaction initiated, may need wallet redirect", event);
          
  //         // Store transaction info in sessionStorage to track across redirects
  //         sessionStorage.setItem('pendingTx', JSON.stringify({
  //           time: Date.now(),
  //           type: 'write'
  //         }));
  //       });
  //     }
  //   }
  // }, []);

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
          signMessageTimeout={120000} // 2 minutes
          signMessageConfig={{
            // Include these to improve mobile experience
            includeAddress: true,
            chainId: true,
            includeDomainAsDedicatedParameter: true,
          }}
          onSignIn={(session) => {
            console.log("User signed in", session);
            
            // This helps refresh UI state after returning from mobile wallet
            if (typeof window !== "undefined") {
              // Clear any stored recovery data
              sessionStorage.removeItem("recovering_session");
              sessionStorage.removeItem("siwe_message");
              sessionStorage.removeItem("siwe_signature");
              sessionStorage.removeItem("pendingTx"); // Clear any pending TX
              
              // Check if we're coming back from a mobile redirect
              const urlParams = new URLSearchParams(window.location.search);
              const redirectAfterAuth = urlParams.get("redirectAfterAuth");

              if (redirectAfterAuth) {
                // Clean URL without reloading the page
                const url = new URL(window.location.href);
                url.searchParams.delete("redirectAfterAuth");
                window.history.replaceState({}, "", url.toString());
              }
            }
          }}
        >
          <ConnectKitProvider
            theme="rounded"
            mode="auto"
            options={{
              embedGoogleFonts: true,
              walletConnectName: "WalletConnect",
              overlayBlur: 4,
              truncateLongENSAddress: true,
              walletConnectCTA: "both",
              enableSIWE: true,
              // hideTooltips: isMobile(),
            }}
          >
            {children}
          </ConnectKitProvider>
        </siweClient.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}