"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Text, PageTransitionOverlay } from "../../components/ui/common";
import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";
import WalletConnector from "../../components/ui/client/WalletConnector";

const SignIn = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { address, isConnected } = useAccount();
  const [redirecting, setRedirecting] = useState(false);

  // Debug logging
  // useEffect(() => {
  //   console.log("SignIn page - Session status:", status);
  //   console.log("SignIn page - Session data:", session);
  //   console.log("SignIn page - Wallet status:", { isConnected, address });
  // }, [session, status, isConnected, address]);

  // Only redirect when FULLY authenticated (both wallet connected AND session exists)
  useEffect(() => {
    const isFullyAuthenticated =
      status === "authenticated" &&
      session?.user?.address &&
      isConnected &&
      address &&
      address.toLowerCase() === session.user.address.toLowerCase();

    if (isFullyAuthenticated && !redirecting) {
      // console.log("User is fully authenticated, redirecting to dashboard");
      // setRedirecting(true);
      
      // Delay to ensure smooth transition
      // setTimeout(() => {
      //   router.push("/dashboard");
      // }, 1500);
    }
  }, [session, status, isConnected, address, router, redirecting]);

  // Show loading overlay while session is loading
  if (status === "loading") {
    return (
      <PageTransitionOverlay
        show={true}
        message="Loading authentication state..."
        status="loading"
        bgColor="bg-indigo-50/80 dark:bg-indigo-950/80"
      />
    );
  }

  return (
    <>
      {/* Redirect overlay */}
      <PageTransitionOverlay
        show={redirecting}
        message="Redirecting to dashboard..."
        status="loading"
        bgColor="bg-indigo-100/90 dark:bg-indigo-900/90"
      />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-indigo-950">
        <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <img
              src="/app/favicon.png"
              alt="NFT Nexus Logo"
              className="mx-auto h-16 w-16 mb-4"
            />
            <Text
              variant="h2"
              color="primary"
              align="center"
              className="bg-gradient-to-r from-[#4B0082] to-[#AAA9CF] bg-clip-text text-transparent"
            >
              Welcome to NFT Nexus
            </Text>
            <Text
              variant="body"
              color="secondary"
              align="center"
              className="mt-2"
            >
              Connect your wallet and sign a message to authenticate
            </Text>
          </div>

          <div className="space-y-6 w-full h-full flex flex-col">
            <div className="w-full h-full flex flex-col items-center justify-center flex-wrap p-4 rounded-lg">
              <Text
                variant="h5"
                color="default"
                align="center"
                className="mb-4"
              >
                Connect with Wallet
              </Text>
              <div className="self-center mx-auto">
                <WalletConnector compact={true} />
              </div>
            </div>

            {/* Show authentication status */}
            {isConnected && (
              <div className="text-center">
                {status === "authenticated" ? (
                  <div className="space-y-2">
                    <Text variant="small" color="success" align="center">
                      ✓ Wallet connected and authenticated
                    </Text>
                  </div>
                ) : (
                  <Text variant="small" color="secondary" align="center">
                    Wallet connected - Please sign the message to authenticate
                  </Text>
                )}
              </div>
            )}

            {/* Instructions */}
            {!isConnected && (
              <div className="text-center">
                <Text variant="small" color="secondary" align="center">
                  Click "Connect Wallet" above to get started
                </Text>
              </div>
            )}

            {/* Authentication steps indicator */}
            <div className=" space-y-1">
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <Text variant="small" color={isConnected ? "success" : "secondary"}>
                  Connect Wallet
                </Text>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${status === "authenticated" ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <Text variant="small" color={status === "authenticated" ? "success" : "secondary"}>
                  Sign Message
                </Text>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${status === "authenticated" ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <Text variant="small" color={status === "authenticated" ? "success" : "secondary"}>
                  Access Dashboard
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
