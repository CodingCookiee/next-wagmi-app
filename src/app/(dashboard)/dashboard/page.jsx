"use client";
import React from "react";
import { Header, Footer, Main } from "../../components/layout";
import { Toaster, Button, Text } from "../../components/ui/common";
import Link from "next/link";
import { MdOutlineCollectionsBookmark } from "react-icons/md";
import { IoMdAnalytics } from "react-icons/io";
import { AiFillInteraction } from "react-icons/ai";
import { FaCartArrowDown } from "react-icons/fa";


export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-between p-0 min-h-screen bg-background">
      <Header />
      <main className="flex-1 container py-8 flex flex-col items-center justify-center">
        <div className="text-center max-w-3xl mx-auto">
          <Text
            variant="h1"
            color="primary"
            weight="semibold"
            align="center"
            className="bg-gradient-to-r from-[#4B0082] to-[#AAA9CF] bg-clip-text text-transparent"
          >
            Welcome to NFT Nexus
          </Text>
          <Text
            variant="body"
            align="center"
            color="secondary"
            className="mt-2"
          >
            Your unified platform to manage, showcase, and monetize your NFT
            collections
          </Text>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {/* Manage Collections */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MdOutlineCollectionsBookmark className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <Text variant="h4" color="default" align="center" className="mb-4">
              Manage Collection
            </Text>
            <Text variant="body" color="secondary" align="center">
              Easily organize and track your NFT portfolio in one place
            </Text>
          </div>

          {/* Analytics Dashboard */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <IoMdAnalytics className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <Text variant="h4" color="default" align="center" className="mb-4">
              Analytics Dashboard
            </Text>
            <Text variant="body" color="secondary" align="center">
              Get insights on your collection value and market trends
            </Text>
          </div>
          {/* MarketPlace */}

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FaCartArrowDown className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <Text variant="h4" color="default" align="center" className="mb-4">
              Marketplace
            </Text>
            <Text variant="body" color="secondary" align="center">
              Buy, sell, and trade NFTs with secure wallet integration
            </Text>
          </div>

          {/* Contract Interactions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <Link href='contract-interactions' className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <AiFillInteraction className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </Link>
            <Link href="/contract-interactions" className="flex flex-col items-center">

            <Text variant="h4" color="default" align="center" className="mb-4">
              Contract Interactions
            </Text>
            </Link>
            <Text variant="body" color="secondary" align="center">
              Interact with smart contracts directly from the dashboard
            </Text>
          </div>
        </div>
      </main>
      <Footer />
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}
