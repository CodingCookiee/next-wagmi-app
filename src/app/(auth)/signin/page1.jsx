"use client";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { Text, Button } from "../../components/ui/common";
import { useSIWE } from "connectkit"; // Import useSIWE hook instead
import WalletConnector from "../../components/ui/client/WalletConnector";

const SignIn = () => {
  const router = useRouter();
  const { signIn, status } = useSIWE(); // Use the hook to access SIWE functionality

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    // Implement Google Sign In logic here
    // After successful sign in, redirect to dashboard
    router.push("/dashboard");
  };

  // Handle successful SIWE authentication
  React.useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-indigo-950">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <img
            src="/app/favicon.png"
            alt="NFT Nexus Logo"
            className="mx-auto h-16 w-16 mb-4"
          />
          <Text variant="h2" color="primary" align="center">
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

        <div className="space-y-6 w-full h-full flex flex-col ">
          <div className="w-full h-full flex flex-col items-center justify-center flex-wrap  p-4 rounded-lg">
            <Text variant="h5" color="default" align="center" className="mb-4">
              Connect with Wallet
            </Text>
            {/* No need for additional providers here */}
            <div className="self-center mx-auto">
              <WalletConnector compact={true} />
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
          >
            <FcGoogle className="h-5 w-5" />
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
