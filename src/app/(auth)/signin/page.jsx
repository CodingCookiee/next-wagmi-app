"use client";

import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import {
  Text,
  Button,
  PageTransitionOverlay,
} from "../../components/ui/common";
import { SIWEButton, useSIWE } from "connectkit";
import WalletConnector from "../../components/ui/client/WalletConnector";

const SignIn = () => {
  const router = useRouter();
  const { isSignedIn, isConnected, loading: siweLoading } = useSIWE();
  const [redirecting, setRedirecting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initial loading check
  useEffect(() => {
    // Once SIWE loading is complete, we can turn off our loading state
    if (!siweLoading) {
      setLoading(false);
    }
  }, [siweLoading]);

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    // setRedirecting(true);
    // // Implement Google Sign In logic here
    // try {
    //   // Mock authentication delay
    //   await new Promise(resolve => setTimeout(resolve, 1000));
    //   // After successful sign in, redirect to dashboard
    //   router.push("/dashboard");
    // } catch (error) {
    //   console.error("Google sign in failed:", error);
    //   setRedirecting(false);
    // }
  };

  // Handle successful SIWE authentication from page-level check
  // useEffect(() => {
  //   if (isSignedIn && isConnected && !redirecting) {
  //     console.log(
  //       "SignIn page: User is authenticated with SIWE and wallet is connected, redirecting to dashboard"
  //     );
  //     setRedirecting(true);

  //     // Small delay to ensure a smooth transition
  //     const redirectTimer = setTimeout(() => {
  //       router.push("/dashboard");
  //     }, 1500); // Increased delay to make the overlay more visible

  //     return () => clearTimeout(redirectTimer);
  //   }
  // }, [isSignedIn, isConnected, router, redirecting]);

  // Called when WalletConnector signals successful authentication
  // const handleSuccessfulAuth = () => {
  //   console.log("SignIn page: Received successful auth notification from wallet connector");

  //   // Only initiate redirect if we're not already redirecting
  //   if (!redirecting) {
  //     setRedirecting(true);

  //     // Small delay to ensure transition is visible
  //     setTimeout(() => {
  //       router.push("/dashboard");
  //     }, 1500);
  //   }
  // };

  return (
    <>
      {/* Page loading overlay */}
      <PageTransitionOverlay
        show={loading}
        message="Loading authentication state..."
        status="loading"
        bgColor="bg-indigo-50/80 dark:bg-indigo-950/80"
      />

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
            <Text variant="h2" color="primary" align="center" className="bg-gradient-to-r from-[#4B0082] to-[#AAA9CF] bg-clip-text text-transparent">
              Welcome to NFT Nexus
            </Text>
            <Text
              variant="body"
              color="secondary"
              align="center"
              className="mt-2"
            >
              Sign in to access your NFT dashboard
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
                <WalletConnector
                  compact={true}
                  // onSuccessfulAuth={handleSuccessfulAuth}
                  // redirectPath="/dashboard"
                />
              </div>

              
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleSignIn}
              disabled={redirecting}
            >
              <FcGoogle className="h-5 w-5" />
              Sign in with Google
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
