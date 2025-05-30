/**
 * Helper functions for mobile wallet deep linking
 */

// Detect if we're on a mobile device
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Get the currently connected wallet type
export const getWalletType = () => {
  // Check localStorage for WalletConnect connection info
  if (typeof window !== 'undefined') {
    try {
      // Check for WalletConnect session
      const wcSession = localStorage.getItem('wagmi.wallet');
      if (wcSession?.includes('walletConnect')) return 'walletConnect';
      
      // Check for Coinbase session
      if (wcSession?.includes('coinbase')) return 'coinbase';
      
      // Check for MetaMask
      if (wcSession?.includes('metaMask') || window.ethereum?.isMetaMask) return 'metamask';
    } catch (e) {
      console.error('Error detecting wallet type:', e);
    }
  }
  return null;
};

// Open the appropriate wallet app
export const openWalletApp = () => {
  if (!isMobile()) return;
  
  const walletType = getWalletType();
  
  // Only show the redirect UI on mobile
  if (walletType === 'walletConnect') {
    // Generic WalletConnect deep link
    window.location.href = 'https://walletconnect.com/wc';
    return true;
  } else if (walletType === 'metamask') {
    window.location.href = 'https://metamask.app.link';
    return true;
  } else if (walletType === 'coinbase') {
    window.location.href = 'https://go.cb-w.com';
    return true;
  }
  
  return false;
};

// Helper to detect wallet-specific deep links
export const getWalletDeepLink = () => {
  const walletType = getWalletType();
  
  if (walletType === 'metamask') {
    return 'https://metamask.app.link';
  } else if (walletType === 'coinbase') {
    return 'https://go.cb-w.com';
  } else if (walletType === 'trust') {
    return 'https://link.trustwallet.com';
  } else if (walletType === 'rainbow') {
    return 'https://rainbow.me';
  } else if (walletType === 'zerion') {
    return 'https://app.zerion.io';
  }
  
  return 'https://walletconnect.com/wc';
};