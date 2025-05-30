import React, { useState, useEffect } from "react";
import {
  getTokenDecimals,
  mintTokens,
  burnTokens,
  approveTokens,
  transferFrom,
  transfer,
  increaseAllowance,
  decreaseAllowance,
} from "../../../services/contractServices.js";
import { Text, Button, Input, Divider, PageTransitionOverlay, TransactionStatusOverlay } from "../common";
import { parseUnits, formatUnits } from "ethers";
import { toast } from "sonner";

export const WriteContract = ({
  chainId,
  address,
  writeContract,
  publicClient,
  isConfirmed,
  isFailed,
  writeError,
}) => {
  const [error, setError] = useState(null);
  const [tokenDecimals, setTokenDecimals] = useState(null);

  // Individual loading states for each operation
  const [isMinting, setIsMinting] = useState(false);
  const [isBurning, setIsBurning] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isTransferringFrom, setIsTransferringFrom] = useState(false);
  const [isIncreasingAllowance, setIsIncreasingAllowance] = useState(false);
  const [isDecreasingAllowance, setIsDecreasingAllowance] = useState(false);
  const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);

  // States for Contract Interactions
  const [mintAmount, setMintAmount] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [approveAmount, setApproveAmount] = useState("");
  const [approveSpender, setApproveSpender] = useState("");
  const [transferFromAmount, setTransferFromAmount] = useState("");
  const [transferFromSender, setTransferFromSender] = useState("");
  const [transferFromRecipient, setTransferFromRecipient] = useState("");
  const [increaseAllowanceSpender, setIncreaseAllowanceSpender] = useState("");
  const [increaseAllowanceAmount, setIncreaseAllowanceAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferRecipient, setTransferRecipient] = useState("");
  const [decreaseAllowanceSpender, setDecreaseAllowanceSpender] = useState("");
  const [decreaseAllowanceAmount, setDecreaseAllowanceAmount] = useState("");

  const fetchTokenData = async () => {
    if (!publicClient || !address) return;

    try {
      // get token decimals
      const tokenDecimals = await getTokenDecimals(publicClient);
      if (tokenDecimals !== undefined) setTokenDecimals(tokenDecimals);
      //   console.log("Token Decimals: ", tokenDecimals);
    } catch (error) {
      console.error("Error fetching token data", error);
      setError("Failed to fetch token data");
      // setIsMinting(false);
    }
  };

  useEffect(() => {
    fetchTokenData();
  }, [publicClient, address]);

  //  handles transaction status changes
  useEffect(() => {
    if (isConfirmed) {
      toast.success("Hurrah! Transaction Confirmed.");
    } else if (isFailed) {
      toast.error("Transaction Failed. Please try again.");
    }

    // Reset all operation states regardless of success or failure
    setError(null);
    setIsMinting(false);
    setIsBurning(false);
    setIsApproving(false);
    setIsTransferring(false);
    setIsTransferringFrom(false);
    setIsIncreasingAllowance(false);
    setIsDecreasingAllowance(false);
  }, [isConfirmed, isFailed]);

  // For errors
  useEffect(() => {
    if (writeError) {
      toast.error("Transaction was rejected by the user");
      console.error("Error handling transaction status: ", writeError);

      // Reset all operation states regardless of success or failure
      setError(null);
      setIsMinting(false);
      setIsBurning(false);
      setIsApproving(false);
      setIsTransferring(false);
      setIsTransferringFrom(false);
      setIsIncreasingAllowance(false);
      setIsDecreasingAllowance(false);
    }
  }, [writeError]);

  const handleMint = async () => {
    if (!mintAmount || !tokenDecimals) return;
    try {
      setError(null);
      setIsMinting(true);

      const amountWei = parseUnits(mintAmount, tokenDecimals);
      await mintTokens(writeContract, amountWei);
      setMintAmount("");
    } catch (error) {
      setError("Error minting tokens ");
      console.error("Error minting tokens: ", error);
      setIsMinting(false);
    }
  };

  const handleBurn = async () => {
    if (!burnAmount || !tokenDecimals) return;

    try {
      setError(null);
      setIsBurning(true);

      const amountWei = parseUnits(burnAmount, tokenDecimals);
      await burnTokens(writeContract, amountWei);
      setBurnAmount("");
    } catch (error) {
      setError("Error burning tokens");
      console.error("Error burning tokens: ", error);
      setIsBurning(false);
    }
  };

  const handleApprove = async () => {
    if (!approveAmount || !approveSpender || !tokenDecimals) return;

    try {
      setError(null);
      setIsApproving(true);

      const amountWei = parseUnits(approveAmount, tokenDecimals);
      await approveTokens(writeContract, approveSpender, amountWei);
      setApproveAmount("");
      setApproveSpender("");
    } catch (error) {
      setError("Error approving tokens");
      console.error("Error approving tokens: ", error);
      setIsApproving(false);
    }
  };

  const handleTransferFrom = async () => {
    if (
      !transferFromAmount ||
      !transferFromRecipient ||
      !transferFromSender ||
      !tokenDecimals
    )
      return;

    try {
      setError(null);
      setIsTransferringFrom(true);

      const amountWei = parseUnits(transferFromAmount, tokenDecimals);
      await transferFrom(
        writeContract,
        transferFromSender,
        transferFromRecipient,
        amountWei
      );
      setTransferFromAmount("");
      setTransferFromSender("");
      setTransferFromRecipient("");
    } catch (error) {
      setError("Error transferring tokens from");
      console.error("Error transferring tokens from", error);
      setIsTransferringFrom(false);
    }
  };

  const handleIncreaseAllowance = async () => {
    if (!increaseAllowanceAmount || !increaseAllowanceSpender || !tokenDecimals)
      return;

    try {
      setError(null);
      setIsIncreasingAllowance(true);

      const amountWei = parseUnits(increaseAllowanceAmount, tokenDecimals);
      await increaseAllowance(
        writeContract,
        increaseAllowanceSpender,
        amountWei
      );
      setIncreaseAllowanceAmount("");
      setIncreaseAllowanceSpender("");
    } catch (error) {
      setError("Error increasing allowance");
      console.error("Error increasing allowance: ", error);
      setIsIncreasingAllowance(false);
    }
  };

  const handleTransfer = async () => {
    if (!transferAmount || !transferRecipient || !tokenDecimals) return;

    try {
      setError(null);
      setIsTransferring(true);

      const amountWei = parseUnits(transferAmount, tokenDecimals);
      await transfer(writeContract, transferRecipient, amountWei);
      setTransferAmount("");
      setTransferRecipient("");
    } catch (error) {
      setError("Error transferring tokens");
      console.error("Error transferring tokens: ", error);
      setIsTransferring(false);
    }
  };

  const handleDecreaseAllowance = async (params) => {
    if (!decreaseAllowanceAmount || !decreaseAllowanceSpender || !tokenDecimals)
      return;

    try {
      setError(null);
      setIsDecreasingAllowance(true);

      const amountWei = parseUnits(decreaseAllowanceAmount, tokenDecimals);
      await decreaseAllowance(
        writeContract,
        decreaseAllowanceSpender,
        amountWei
      );
      setDecreaseAllowanceAmount("");
      setDecreaseAllowanceSpender("");
    } catch (error) {
      setError("Error decreasing allowance");
      console.error("Error decreasing allowance: ", error);
      setIsDecreasingAllowance(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-start justify-start  gap-4">
      {/* Write Contract Section */}
      <div className="w-full h-full flex flex-col items-start justify-start px-5 gap-4">
        <div className="flex flex-col items-start justify-center w-full">
          {/* Mint Section */}
          <div className="flex flex-col items-start gap-2.5 w-full">
            <Text variant="h4" weight="semibold" align="left">
              Mint
            </Text>
            <Input
              type="text"
              required
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              placeholder="Amount to mint"
            />
            <Button
              variant="default"
              onClick={handleMint}
              disabled={!mintAmount || isMinting}
            >
              {isMinting ? "Minting..." : "Mint"}
            </Button>
          </div>

          <Divider className="w-full h-1 bg-neutral-300" />

          {/* Burn Section */}
          {/* <div className="flex flex-col items-start gap-2.5 w-full">
            <Text variant="h4" weight="semibold" align="left">
              Burn
            </Text>
            <Input
              type="text"
              required
              value={burnAmount}
              onChange={(e) => setBurnAmount(e.target.value)}
              placeholder="Amount to burn"
            />
            <Button
              variant="default"
              onClick={handleBurn}
              disabled={!burnAmount || isBurning}
            >
              {isBurning ? "Burning..." : "Burn"}
            </Button>
          </div> */}

          <Divider className="w-full h-1 bg-neutral-300" />

          {/* Approve Section */}
          <div className="flex flex-col items-start gap-2.5 w-full">
            <Text variant="h4" weight="semibold" align="left">
              Approve
            </Text>
            <Input
              type="text"
              required
              value={approveSpender}
              onChange={(e) => setApproveSpender(e.target.value)}
              placeholder="Spender address"
            />
            <Input
              type="text"
              required
              value={approveAmount}
              onChange={(e) => setApproveAmount(e.target.value)}
              placeholder="Amount to approve"
            />
            <Button
              variant="default"
              onClick={handleApprove}
              disabled={!approveAmount || !approveSpender || isApproving}
            >
              {isApproving ? "Approving..." : "Approve"}
            </Button>
          </div>



          <Divider className="w-full h-1 bg-neutral-300" />

          {/* Increase Allowance Section */}
          <div className="flex flex-col items-start gap-2.5 w-full">
            <Text variant="h4" weight="semibold" align="left">
              Increase Allowance
            </Text>
            <Input
              type="text"
              required
              value={increaseAllowanceSpender}
              onChange={(e) => setIncreaseAllowanceSpender(e.target.value)}
              placeholder="Spender address"
            />
            <Input
              type="text"
              required
              value={increaseAllowanceAmount}
              onChange={(e) => setIncreaseAllowanceAmount(e.target.value)}
              placeholder="Amount to add"
            />
            <Button
              variant="default"
              onClick={handleIncreaseAllowance}
              disabled={
                !increaseAllowanceAmount ||
                !increaseAllowanceSpender ||
                isIncreasingAllowance
              }
            >
              {isIncreasingAllowance ? "Processing..." : "Increase Allowance"}
            </Button>
          </div>

          <Divider className="w-full h-1 bg-neutral-300" />

          {/* decrease Allowance Section */}
          <div className="flex flex-col items-start gap-2.5 w-full">
            <Text variant="h4" weight="semibold" align="left">
              Decrease Allowance
            </Text>
            <Input
              type="text"
              required
              value={decreaseAllowanceSpender}
              onChange={(e) => setDecreaseAllowanceSpender(e.target.value)}
              placeholder="Spender address"
            />
            <Input
              type="text"
              required
              value={decreaseAllowanceAmount}
              onChange={(e) => setDecreaseAllowanceAmount(e.target.value)}
              placeholder="Amount to Subtract"
            />
            <Button
              variant="default"
              onClick={handleDecreaseAllowance}
              disabled={
                !decreaseAllowance ||
                !decreaseAllowanceSpender ||
                isDecreasingAllowance
              }
            >
              {isDecreasingAllowance ? "Processing..." : "Decrease Allowance"}
            </Button>
          </div>

          <Divider className="w-full h-1 bg-neutral-300" />

          {/* Transfer From Section */}
          <div className="flex flex-col items-start gap-2.5 w-full">
            <Text variant="h4" weight="semibold" align="left">
              Transfer From
            </Text>
            <Input
              type="text"
              required
              value={transferFromSender}
              onChange={(e) => setTransferFromSender(e.target.value)}
              placeholder="Sender address"
            />
            <Input
              type="text"
              required
              value={transferFromRecipient}
              onChange={(e) => setTransferFromRecipient(e.target.value)}
              placeholder="Recipient address"
            />
            <Input
              type="text"
              required
              value={transferFromAmount}
              onChange={(e) => setTransferFromAmount(e.target.value)}
              placeholder="Amount"
            />
            <Button
              variant="default"
              onClick={handleTransferFrom}
              disabled={
                !transferFromAmount ||
                !transferFromSender ||
                !transferFromRecipient ||
                isTransferringFrom
              }
            >
              {isTransferringFrom ? "Transferring..." : "Transfer From"}
            </Button>
          </div>
          {/* Transfer Section */}
          <div className="flex flex-col items-start gap-2.5 w-full">
            <Text variant="h4" weight="semibold" align="left">
              Transfer
            </Text>
            <Input
              type="text"
              required
              value={transferRecipient}
              onChange={(e) => setTransferRecipient(e.target.value)}
              placeholder="Recipient address"
            />
            <Input
              type="text"
              required
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="Amount"
            />
            <Button
              variant="default"
              onClick={handleTransfer}
              disabled={!transferAmount || !transferRecipient || isTransferring}
            >
              {isTransferring ? "Processing..." : "Transfer"}
            </Button>
          </div>

          <Divider className="w-full h-1 bg-neutral-300" />
        </div>

        {/* Error display */}
        {error && (
          <div className="w-full p-3 bg-red-100 rounded-lg mt-4">
            <Text variant="body" color="error" align="center">
              {error}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};
