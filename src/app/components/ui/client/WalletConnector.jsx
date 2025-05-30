"use client";

import { useEffect, useState } from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { Text, Loader, Button, PageTransitionOverlay } from "../common";
import { useRouter } from "next/navigation";
import { useSIWE } from "connectkit";
import styled from "styled-components";
import Link from "next/link";

const StyledButton = styled.button`
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: ${(props) => (props.compact ? "10px 16px" : "14px 24px")};
  color: #ffffff;
  background: #4b0082;
  font-size: ${(props) => (props.compact ? "14px" : "16px")};
  font-weight: 500;
  border-radius: 10rem;
  box-shadow: 0 4px 24px -6px #4b0082;

  transition: 200ms ease;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 6px 40px -6px #4b0082;
  }
  &:active {
    transform: translateY(-3px);
    box-shadow: 0 6px 32px -6px #4b0082;
  }
`;

// Detect if we're on a mobile device
// const isMobile = () => {
//   if (typeof window === 'undefined') return false;
//   return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
//     navigator.userAgent
//   );
// };

export default function WalletConnector({
  compact = false,
  onSuccessfulAuth,
  redirectPath,
}) {
  const [redirecting, setIsRedirecting] = useState(false);
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const router = useRouter();
  const {
    isSignedIn,
    signIn,
    signOut,
    status,
    error,
    isLoading: siweLoading,
  } = useSIWE();

  // When the component mounts, check if we need to navigate after a successful mobile auth
  // useEffect(() => {
  //   if (isSignedIn && isConnected && isMobile()) {
  //     // This is important for mobile - ensures the app knows we're signed in
  //     const urlParams = new URLSearchParams(window.location.search);
  //     const redirect = urlParams.get('redirectAfterAuth');
      
  //     if (redirect) {
  //       setIsRedirecting(true);
  //       setTimeout(() => {
  //         router.push(redirect);
  //       }, 300);
  //     }
  //   }
  // }, [isSignedIn, isConnected, router]);

  const handleDashboardClick = (e) => {
    e.preventDefault(); // Prevent default link behavior
    setIsRedirecting(true);

    // Wait a moment to show the transition before navigating
    setTimeout(() => {
      router.push("/dashboard");
    }, 300);
  };
  


  return (
    <>
      {/* Redirect overlay */}
      <PageTransitionOverlay
        show={redirecting}
        message="Redirecting to dashboard..."
        status="loading"
        bgColor="bg-indigo-100/90 dark:bg-indigo-900/90"
      />
      <div
        className={
          compact
            ? "w-full"
            : "w-full min-h-screen flex flex-col items-center justify-center p-10 gap-10"
        }
      >
        {isConnecting || siweLoading ? (
          <div className="flex items-center justify-between gap-4">
            <Loader width="w-5" height="h-5" />
            <Text
              variant="small"
              color="secondary"
              weight="normal"
              className="uppercase text-xs"
            >
              {isConnecting ? "Connecting..." : "Verifying..."}
            </Text>
          </div>
        ) : (
          <div
            className={
              compact
                ? "w-full"
                : "max-w-5xl w-full flex items-center justify-center flex-col"
            }
          >
            <ConnectKitButton.Custom>
              {({ isConnected, show, truncatedAddress, ensName }) => {
                return (
                  <div className="w-full flex flex-col items-center justify-center gap-4 ">
                    <StyledButton
                      onClick={show}
                      compact={compact}
                      className="px-5"
                    >
                      {isConnected
                        ? ensName ?? truncatedAddress ?? "Connected"
                        : "Connect Wallet"}
                    </StyledButton>

                   
                    {isSignedIn && isConnected && (
                      <div className="flex flex-col items-center gap-2.5">
                        <div className="flex items-center text-green-500">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="text-sm">Wallet verified</span>
                        </div>

                        <div className="">
                          <Link
                            href="/dashboard"
                            onClick={handleDashboardClick}
                          >
                            <StyledButton className="px-5" compact={compact}>
                              Launch Dashboard
                            </StyledButton>
                          </Link>
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="text-red-500 text-sm mt-2 p-3 bg-red-100 rounded-lg">
                        <p className="font-semibold">Error:</p>
                        <p>{error.message}</p>
                        {/* {isMobile() && (
                          <p className="mt-2 text-xs">
                            Note: On mobile, you may need to return to your wallet app to complete the signature.
                          </p>
                        )} */}
                      </div>
                    )}
                  </div>
                );
              }}
            </ConnectKitButton.Custom>
          </div>
        )}

        {!compact && address && (
          <div className="max-w-5xl w-full flex items-center justify-center">
            <Text variant="h3" color="secondary">
              Connected to {address.slice(0, 6)}...{address.slice(-4)}
            </Text>
          </div>
        )}

        {!compact && isSignedIn && (
          <div className="max-w-5xl w-full flex items-center justify-center">
            <Text variant="h5" color="success">
              ✓ Wallet verified with SIWE
            </Text>
          </div>
        )}
      </div>
    </>
  );
}