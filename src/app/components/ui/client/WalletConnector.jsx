"use client";

import { useEffect, useState, useCallback } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { Text, Loader, PageTransitionOverlay, Button } from "../common";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useSiweAuth } from "../../../hooks/useSiweAuth";
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

export default function WalletConnector({ compact = false, className }) {
  const [redirecting, setIsRedirecting] = useState(false);
  const [authAttempted, setAuthAttempted] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: session, status: sessionStatus } = useSession();
  const {
    signInWithEthereum,
    isLoading: siweLoading,
    error: siweError,
    clearError,
  } = useSiweAuth();
  const router = useRouter();

  // Handle mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset auth state when wallet disconnects
  useEffect(() => {
    if (!isConnected && session) {
      signOut({ redirect: false });
      setAuthAttempted(false);
      clearError();
    }
  }, [isConnected, clearError, session]);

  // Debug logging
  // useEffect(() => {
  //   console.log("Wallet state:", {
  //     isConnected,
  //     isConnecting,
  //     isReconnecting,
  //     address,
  //     sessionStatus,
  //     authAttempted
  //   });
  // }, [isConnected, isConnecting, isReconnecting, address, sessionStatus, authAttempted]);

  // Handle SIWE authentication when wallet connects
  useEffect(() => {
    const shouldAuthenticate =
      mounted &&
      isConnected &&
      address &&
      !isConnecting &&
      !isReconnecting &&
      sessionStatus !== "authenticated" &&
      sessionStatus !== "loading" &&
      !siweLoading &&
      !authAttempted;
    //  hasRecentlyDisconnected;

    if (shouldAuthenticate) {
      // console.log("Starting SIWE authentication...");
      handleSiweAuth();
    }
  }, [
    mounted,
    isConnected,
    address,
    isConnecting,
    isReconnecting,
    sessionStatus,
    siweLoading,
    authAttempted,
  ]);

  const handleSiweAuth = useCallback(async () => {
    if (authAttempted) return;

    try {
      setAuthAttempted(true);
      clearError();

      // Wait a bit longer for wallet to be fully ready
      // await new Promise(resolve => setTimeout(resolve, 500));

      await signInWithEthereum();
      // console.log("SIWE authentication successful");
    } catch (error) {
      console.error("SIWE authentication failed:", error);
      // Reset auth attempted on certain errors so user can retry
      if (
        error.message.includes("not authorized") ||
        error.message.includes("rejected")
      ) {
        setTimeout(() => setAuthAttempted(false), 2000);
      }
    }
  }, [signInWithEthereum, authAttempted, clearError]);

  // const handleManualAuth = useCallback(async () => {
  //   setAuthAttempted(false);
  //   clearError();
  //   // Small delay then trigger auth
  //   setTimeout(() => {
  //     handleSiweAuth();
  //   }, 100);
  // }, [handleSiweAuth, clearError]);

  const handleDashboardClick = (e) => {
    e.preventDefault();

    if (isFullyAuthenticated) {
      setIsRedirecting(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 300);
    }
  };

  const handleDisconnect = useCallback(async () => {

    setAuthAttempted(false);
    clearError();
    await signOut({ redirect: false });
    await disconnect();
    setTimeout(() => {
      localStorage.clear();
      sessionStorage.clear();
    }, 500);

    // setTimeout(() => {
    //   window.location.reload();
    // }, 500);
  }, [disconnect, clearError]);

  // Determine if user is fully authenticated
  const isFullyAuthenticated =
    isConnected &&
    sessionStatus === "authenticated" &&
    session?.user?.address &&
    session.user.address.toLowerCase() === address?.toLowerCase();

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <>
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
        {isConnecting || isReconnecting || siweLoading ? (
          <div className="flex items-center justify-between gap-4">
            <Loader width="w-5" height="h-5" />
            <Text
              variant="small"
              color="secondary"
              weight="normal"
              className="uppercase text-xs"
            >
              {isConnecting || isReconnecting
                ? "Connecting..."
                : "Authenticating..."}
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
                mounted: rbkMounted,
              }) => {
                const ready = rbkMounted && mounted;
                const connected = ready && account && chain && isConnected;

                return (
                  <div
                    className={className}
                    {...(!ready && {
                      "aria-hidden": true,
                      style: {
                        opacity: 0,
                        pointerEvents: "none",
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <Button
                            variant="outline"
                            onClick={() => {
                              try {
                                setAuthAttempted(false);
                                clearError();
                                openConnectModal();
                              } catch (error) {
                                console.error(
                                  "Error opening connect modal:",
                                  error
                                );
                              }
                            }}
                            type="button"
                            className="px-6 py-5 bg-gradient-to-r from-purple-700 to-indigo-600 text-white hover:text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                          >
                            Connect Wallet
                          </Button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <Button
                            variant="destructive"
                            onClick={() => {
                              try {
                                openChainModal();
                              } catch (error) {
                                console.error(
                                  "Error opening chain modal:",
                                  error
                                );
                              }
                            }}
                            type="button"
                            className="px-6 py-5"
                          >
                            Wrong Network
                          </Button>
                        );
                      }

                      return (
                        <div className="text-center">
                          {/* Connection Status */}
                          <div className="mb-4">
                            {siweLoading ? (
                              <div className="flex items-center justify-center text-yellow-500">
                                <Loader width="w-4" height="h-4" />
                                <span className="text-sm ml-2">
                                  Signing message...
                                </span>
                              </div>
                            ) : isFullyAuthenticated ? (
                              <Text
                                align="center"
                                className="text-green-600 dark:text-green-400"
                              >
                                ✓ Wallet Connected & Authenticated
                              </Text>
                            ) : (
                              <div className="space-y-2">
                                <Text
                                  align="center"
                                  className="text-orange-500"
                                >
                                  ✓ Wallet Connected - Please sign the message
                                  to authenticate
                                </Text>
                                {/* {!siweLoading && (
                                  <Button
                                    variant="outline"
                                    onClick={handleManualAuth}
                                    className="text-xs px-3 py-1"
                                    disabled={siweLoading}
                                  >
                                    Sign Message to Authenticate
                                  </Button>
                                )} */}
                              </div>
                            )}
                          </div>

                          {/* Error Display */}
                          {/* {siweError && (
                            <div className="mb-4 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
                              {siweError}
                              <button
                                onClick={handleManualAuth}
                                className="ml-2 text-blue-500 underline text-xs"
                              >
                                Try Again
                              </button>
                            </div>
                          )} */}

                          {/* Chain and Account Controls */}
                          <div className="flex flex-col space-y-3">
                            <Button
                              variant="outline"
                              onClick={() => {
                                try {
                                  openChainModal();
                                } catch (error) {
                                  console.error(
                                    "Error opening chain modal:",
                                    error
                                  );
                                }
                              }}
                              type="button"
                            >
                              {chain.hasIcon && (
                                <div className="mr-2">
                                  {chain.iconUrl && (
                                    <img
                                      alt={chain.name ?? "Chain icon"}
                                      src={chain.iconUrl}
                                      className="h-6 w-6"
                                    />
                                  )}
                                </div>
                              )}
                              {chain.name ?? chain.id}
                            </Button>

                            <Button
                              variant="outline"
                              onClick={() => {
                                try {
                                  openAccountModal();
                                } catch (error) {
                                  console.error(
                                    "Error opening account modal:",
                                    error
                                  );
                                }
                              }}
                              type="button"
                            >
                              {account.displayName}
                              {account.displayBalance
                                ? ` (${account.displayBalance})`
                                : ""}
                            </Button>

                            {/* Dashboard button - only if fully authenticated */}
                            {isFullyAuthenticated && (
                              <Link
                                href="/dashboard"
                                onClick={handleDashboardClick}
                              >
                                <Button
                                  variant="default"
                                  className="w-full bg-gradient-to-r from-purple-700 to-indigo-600 text-white hover:text-white"
                                >
                                  Launch Dashboard
                                </Button>
                              </Link>
                            )}

                            {/* Disconnect button */}
                            <Button
                              variant="destructive"
                              onClick={handleDisconnect}
                              className="text-sm"
                            >
                              Disconnect
                            </Button>
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
      </div>
    </>
  );
}
