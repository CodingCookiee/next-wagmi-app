"use client";

import React from "react";
import { FaBookOpenReader } from "react-icons/fa6";
import { TfiWrite } from "react-icons/tfi";
import { GiCoins } from "react-icons/gi";
import {
  Text,
  Button,
  Input,
  Divider,
  TransactionStatusOverlay,
} from "../../components/ui/common";
import {
  ReadContract,
  WriteContract,
  StakingContract,
} from "../../components/ui/client";
import {
  useAccount,
  usePublicClient,
  useWriteContract,
  useChainId,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { toast } from "sonner";

const Page = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const chainId = useChainId();
  const {
    writeContract,
    isPending: isWritePending,
    data: hash,
    error: writeError,
  } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isFailed,
  } = useWaitForTransactionReceipt({ hash });

  return (
    <div className="container py-20 flex flex-col items-center justify-center">
      {/* TransactionStatusOverlay component */}
      <TransactionStatusOverlay
        isWritePending={isWritePending}
        isConfirming={isConfirming}
        isConfirmed={isConfirmed}
        isFailed={isFailed}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl mb-10">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FaBookOpenReader className="cursor-pointer h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <Text
            variant="h4"
            color="default"
            align="center"
            weight="medium"
            className="mb-4 cursor-pointer bg-gradient-to-r from-[#4B0082] to-[#AAA9CF] bg-clip-text text-transparent"
          >
            Read Contract
          </Text>
          <ReadContract
            chainId={chainId}
            address={address}
            isConfirmed={isConfirmed}
            publicClient={publicClient}
          />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <TfiWrite className="cursor-pointer h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <Text
            variant="h4"
            color="default"
            align="center"
            weight="medium"
            className="mb-4 cursor-pointer bg-gradient-to-r from-[#4B0082] to-[#AAA9CF] bg-clip-text text-transparent"
          >
            Write Contract
          </Text>
          <WriteContract
            chainId={chainId}
            address={address}
            writeContract={writeContract}
            publicClient={publicClient}
            data={hash}
            isPending={isWritePending}
            writeError={writeError}
            isLoading={isConfirming}
            isConfirmed={isConfirmed}
            isFailed={isFailed}
          />
        </div>
      </div>

      {/* Staking Contract Section */}
      <div className="w-full max-w-5xl">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <GiCoins className="cursor-pointer h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <Text
            variant="h4"
            color="default"
            align="center"
            weight="medium"
            className="mb-4 cursor-pointer bg-gradient-to-r from-[#4B0082] to-[#AAA9CF] bg-clip-text text-transparent"
          >
            Staking Contract
          </Text>
          <StakingContract
            chainId={chainId}
            address={address}
            writeContract={writeContract}
            publicClient={publicClient}
            isConfirmed={isConfirmed}
            isFailed={isFailed}
            writeError={writeError}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
