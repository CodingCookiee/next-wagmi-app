"use client";

import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Text, Loader, Button, PageTransitionOverlay } from "../common";
import { useRouter } from "next/navigation";
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

export default function WalletConnector({
  compact = false,
  onSuccessfulAuth,
  redirectPath,
}) {
  const [redirecting, setIsRedirecting] = useState(false);
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const router = useRouter();

  const handleDashboardClick = (e) => {
    e.preventDefault(); // Prevent default link behavior
    setIsRedirecting(true);

    // Wait a moment to show the transition before navigating
    setTimeout(() => {
      router.push("/dashboard");
    }, 300);
  };

  // Handle successful connection
  useEffect(() => {
    if (isConnected && onSuccessfulAuth) {
      onSuccessfulAuth();
    }
  }, [isConnected, onSuccessfulAuth]);

  // Handle redirect after connection
  useEffect(() => {
    if (isConnected && redirectPath) {
      setIsRedirecting(true);
      setTimeout(() => {
        router.push(redirectPath);
      }, 300);
    }
  }, [isConnected, redirectPath, router]);

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
        {isConnecting ? (
          <div className="flex items-center justify-between gap-4">
            <Loader width="w-5" height="h-5" />
            <Text
              variant="small"
              color="secondary"
              weight="normal"
              className="uppercase text-xs"
            >
              Connecting...
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
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== "loading";
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === "authenticated");

                return (
                  <div className="w-full flex flex-col items-center justify-center gap-4">
                    {(() => {
                      if (!connected) {
                        return (
                          <StyledButton
                            onClick={openConnectModal}
                            compact={compact}
                            className="px-5"
                          >
                            Connect Wallet
                          </StyledButton>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <StyledButton
                            onClick={openChainModal}
                            compact={compact}
                            className="px-5 bg-red-600 hover:bg-red-700"
                          >
                            Wrong network
                          </StyledButton>
                        );
                      }

                      return (
                        <div className="flex flex-col items-center gap-4">
                          <StyledButton
                            onClick={openAccountModal}
                            compact={compact}
                            className="px-5"
                          >
                            {account.displayName}
                            {account.displayBalance
                              ? ` (${account.displayBalance})`
                              : ""}
                          </StyledButton>

                          {/* Connected status indicator */}
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
                            <span className="text-sm">Wallet connected</span>
                          </div>

                          {/* Dashboard button */}
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
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        )}

        {!compact && address && (
          <div className="max-w-5xl w-full flex items-center justify-center">
            <Text variant="h3" color="secondary">
              Connected to {address.slice(0, 6)}...{address.slice(-4)}
            </Text>
          </div>
        )}

        {!compact && isConnected && (
          <div className="max-w-5xl w-full flex items-center justify-center">
            <Text variant="h5" color="success">
              ✓ Wallet connected successfully
            </Text>
          </div>
        )}
      </div>
    </>
  );
}
