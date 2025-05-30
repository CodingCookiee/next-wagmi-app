
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';
import { createConfig, http } from "wagmi";


const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "11155111");
const activeChain = chainId === 1 ? mainnet : sepolia;


const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://192.168.30.44:3000";

export const config = getDefaultConfig({
  appName: "NFT Nexus",
  appDescription: "NFT Nexus - Your NFT Dashboard & Marketplace",
  appUrl: APP_URL,
  appIcon: "/app/favicon.png",
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,

  chains: [activeChain],
 transports: {
      [mainnet.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
      ),
      [sepolia.id]: http(
        process.env.NEXT_PUBLIC_RPC_URL || "https://eth-sepolia.public.blastapi.io"
      ),
    },
  })

