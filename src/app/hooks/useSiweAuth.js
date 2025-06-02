"use client";

import { useState, useCallback } from 'react';
import { useSignMessage, useAccount, useChainId } from 'wagmi';
import { signIn } from 'next-auth/react';
import { SiweMessage } from 'siwe';

export function useSiweAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { address } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();

  const signInWithEthereum = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!address) {
        throw new Error('No wallet address found');
      }

      // Get CSRF token
      const csrfRes = await fetch('/api/auth/csrf');
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

      // Sign the message
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

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
  }, [address, chainId, signMessageAsync]);

  return {
    signInWithEthereum,
    isLoading,
    error,
  };
}
