import { Geist, Geist_Mono } from "next/font/google";
// import { ClientProviders } from './components/providers/ClientProviders'
import { Web3Providers } from './components/providers/Web3Providers'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NFT Nexus",
  description: "NFT Nexus is a decentralized NFT dashboard and marketplace designed to empower users by providing a unified platform to manage, showcase, and monetize their NFT collections. Seamlessly integrating wallet connectivity with cutting-edge analytics, NFT Nexus bridges the gap between traditional art marketplaces and the burgeoning world of blockchain-powered digital assets.",
  icons: {
    icon: [
      {
        url: '/app/favicon.png',
        type: 'image/png+xml',
        sizes: 'any',
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Web3Providers> 
         
            {children}
         </Web3Providers>
      </body>
    </html>
  );
}
