import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, polygon, arbitrum, optimism, base } from 'wagmi/chains';
import { http } from "wagmi";

// Define all supported chains
const supportedChains = [mainnet, sepolia];

// Get the default chain from environment or fallback to sepolia
const defaultChainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "11155111");
const defaultChain = supportedChains.find(chain => chain.id === defaultChainId) || sepolia;

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://192.168.30.44:3000";

export const config = getDefaultConfig({
  appName: "NFT Nexus",
  appDescription: "NFT Nexus - Your NFT Dashboard & Marketplace",
  appUrl: APP_URL,
  appIcon: "/app/favicon.png",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,

  chains: supportedChains,
  transports: {
    [mainnet.id]: http(
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
    ),
    [sepolia.id]: http(
      process.env.NEXT_PUBLIC_RPC_URL || "https://eth-sepolia.public.blastapi.io"
    ),
  
  },
});

// Export supported chains and default chain for use in other components
export { supportedChains, defaultChain };
