"use client";

import { useState, useCallback } from 'react';
import { useSignMessage, useAccount, useChainId } from 'wagmi';
import { signIn } from 'next-auth/react';
import { SiweMessage } from 'siwe';

export function useSiweAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();

  const signInWithEthereum = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if wallet is properly connected
      if (!address || !isConnected) {
        throw new Error('Wallet not connected');
      }

      // Add a small delay to ensure wallet is fully ready
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get CSRF token
      const csrfRes = await fetch('/api/auth/csrf');
      if (!csrfRes.ok) {
        throw new Error('Failed to get CSRF token');
      }
      const { csrfToken } = await csrfRes.json();

      // Create SIWE message
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: 'Sign in to NFT Nexus',
        uri: window.location.origin,
        version: '1',
        chainId: chainId,
        nonce: csrfToken,
      });

      // console.log('Created SIWE message:', message);

      // Sign the message with better error handling
      let signature;
      try {
        signature = await signMessageAsync({
          message: message.prepareMessage(),
        });
      } catch (signError) {
        console.error('Message signing failed:', signError);
        if (signError.message.includes('User rejected') || signError.message.includes('denied')) {
          throw new Error('Message signing was rejected by user');
        } else if (signError.message.includes('unauthorized') || signError.message.includes('not authorized')) {
          throw new Error('Wallet not authorized. Please try reconnecting your wallet.');
        }
        throw new Error('Failed to sign message. Please try again.');
      }

      // console.log('Message signed successfully');

      // Authenticate with NextAuth
      const result = await signIn('siwe', {
        message: JSON.stringify(message),
        signature: signature,
        redirect: false,
      });

      // console.log('NextAuth sign in result:', result);

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    } catch (err) {
      console.error('SIWE authentication error:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [address, chainId, signMessageAsync, isConnected]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    signInWithEthereum,
    isLoading,
    error,
    clearError,
  };
}
