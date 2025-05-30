import React, { useState, useEffect } from "react";
import { formatUnits, parseUnits } from "ethers";
import { toast } from "sonner";
import { Text, Button, Input, Divider, LoadingDots } from "../common";
import {
  getBalanceOf,
  getStakingPeriod,
  getTokenEarned,
  getFinishTime,
  getRewardRate,
  getTotalSupply,
  getStakingToken,
  getRewardsToken,
  getOwner,
  stakeTokens,
  withdrawTokens,
  getReward,
  approveStakingContract,
  setRewardsDuration,
  notifyRewardAmount,
} from "../../../services/stakingService.js";
import { getAllowance, getBalanceOf as getRewardTokenBalance } from "../../../services/contractServices.js";

export const StakingContract = ({
  isConfirmed,
  address,
  publicClient,
  writeContract,
  isFailed,
  writeError,
}) => {
  const STAKING_CONTRACT_ADDRESS =
    process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS;

  // States for storing data
  const [stakedBalance, setStakedBalance] = useState("");
  const [stakingPeriod, setStakingPeriod] = useState("");
  const [earnedTokens, setEarnedTokens] = useState("");
  const [finishTime, setFinishTime] = useState("");
  const [rewardRate, setRewardRate] = useState("");
  const [totalStaked, setTotalStaked] = useState("");
  const [stakingTokenAddress, setStakingTokenAddress] = useState("");
  const [rewardsTokenAddress, setRewardsTokenAddress] = useState("");
  const [currentAllowance, setCurrentAllowance] = useState("");
  const [contractOwner, setContractOwner] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [contractRewardBalance, setContractRewardBalance] = useState("");

  // Input states
  const [approveAmount, setApproveAmount] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Admin input states
  const [newDuration, setNewDuration] = useState("");
  const [rewardAmount, setRewardAmount] = useState("");

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isSettingDuration, setIsSettingDuration] = useState(false);
  const [isNotifyingReward, setIsNotifyingReward] = useState(false);

  // Error state
  const [error, setError] = useState(null);

  // Helper function to format token amounts
  const formatTokenAmount = (amount) => {
    if (!amount) return "0";
    try {
      const formatted = formatUnits(amount, 18);
      return parseFloat(formatted)
        .toFixed(6)
        .replace(/\.?0+$/, "");
    } catch (err) {
      console.error("Error formatting token amount: ", err);
      return "0";
    }
  };

  // Helper function to handle max staking
  const handleMaxStake = () => {
    if (currentAllowance) {
      const maxAmount = formatUnits(currentAllowance, 18);
      setStakeAmount(maxAmount);
    }
  };

  // Helper function to handle max withdrawal
  const handleMaxWithdraw = () => {
    if (stakedBalance) {
      const maxAmount = formatUnits(stakedBalance, 18);
      setWithdrawAmount(maxAmount);
    }
  };

  const fetchStakingData = async () => {
    if (!publicClient) return;

    setIsLoading(true);
    setError(null);

    try {
      // User staked balance
      if (address) {
        const balance = await getBalanceOf(publicClient, address);
        if (balance) {
          setStakedBalance(balance);
        }
      }

      // Staking period
      const period = await getStakingPeriod(publicClient);
      if (period) {
        const periodInDays = Math.floor(Number(period) / (24 * 60 * 60));
        setStakingPeriod(periodInDays.toString());
      }

      // Earned tokens
      if (address) {
        const earned = await getTokenEarned(publicClient, address);
        if (earned) {
          setEarnedTokens(earned);
        }
      }

      // Finish time
      const finish = await getFinishTime(publicClient);
      if (finish) {
        const date = new Date(Number(finish) * 1000);
        setFinishTime(date.toLocaleString());
      }

      // Reward rate
      const rate = await getRewardRate(publicClient);
      if (rate) {
        setRewardRate(rate);
      }

      // Total staked
      const total = await getTotalSupply(publicClient);
      if (total) {
        setTotalStaked(total);
      }

      // Staking token address
      const stakingToken = await getStakingToken(publicClient);
      if (stakingToken) {
        setStakingTokenAddress(stakingToken);
      }

      // Rewards token address
      const rewardsToken = await getRewardsToken(publicClient);
      if (rewardsToken) {
        setRewardsTokenAddress(rewardsToken);
      }

      const rewardBalance = await getRewardTokenBalance(publicClient, rewardsToken);
      setContractRewardBalance(rewardBalance);

      // Contract owner
      const owner = await getOwner(publicClient);
      if (owner) {
        setContractOwner(owner);
        setIsOwner(address && owner.toLowerCase() === address.toLowerCase());
      }

      // Current allowance
      if (address) {
        const allowance = await getAllowance(
          publicClient,
          address,
          STAKING_CONTRACT_ADDRESS
        );
        if (allowance) {
          setCurrentAllowance(allowance);
        }
      }
    } catch (err) {
      console.error("Error fetching staking data: ", err);
      setError("Error fetching staking data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchStakingData();
  }, [publicClient, address]);

  // Refetch data when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      fetchStakingData();

      // Reset states
      setIsApproving(false);
      setIsStaking(false);
      setIsWithdrawing(false);
      setIsClaiming(false);
      setIsSettingDuration(false);
      setIsNotifyingReward(false);
      setApproveAmount("");
      setStakeAmount("");
      setWithdrawAmount("");
      setNewDuration("");
      setRewardAmount("");
    }
  }, [isConfirmed]);

  // Handle transaction errors
  useEffect(() => {
    if (isFailed || writeError) {
      toast.error("Transaction failed. Please try again.");

      // Reset states
      setIsApproving(false);
      setIsStaking(false);
      setIsWithdrawing(false);
      setIsClaiming(false);
      setIsSettingDuration(false);
      setIsNotifyingReward(false);
    }
  }, [isFailed, writeError]);

  const handleApprove = async () => {
    if (!approveAmount || !writeContract || !publicClient) return;

    try {
      setError(null);
      setIsApproving(true);

      const amountWei = parseUnits(approveAmount, 18);
      const stakingTokenAddress = await getStakingToken(publicClient);

      await approveStakingContract(
        writeContract,
        stakingTokenAddress,
        amountWei
      );
      toast.success("Approval transaction submitted!");
    } catch (err) {
      console.error("Error approving tokens: ", err);
      setError("Error approving tokens. Please try again.");
      setIsApproving(false);
    }
  };

  const handleStake = async () => {
    if (!stakeAmount || !writeContract || !publicClient) return;

    try {
      setError(null);

      let amountWei;
      try {
        amountWei = parseUnits(stakeAmount.toString(), 18);
      } catch (parseError) {
        toast.error("Invalid amount format. Please enter a valid number.");
        return;
      }

      // console.log("=== STAKING DEBUG ===");
      // console.log("Input amount:", stakeAmount);
      // console.log("Amount in wei:", amountWei.toString());
      // console.log("Current allowance in wei:", currentAllowance.toString());
      // console.log("Difference:", (currentAllowance - amountWei).toString());
      // console.log("Is amount <= allowance:", amountWei <= currentAllowance);

      if (amountWei > currentAllowance) {
        const availableFormatted = formatTokenAmount(currentAllowance);
        toast.error(
          `Insufficient allowance. You have ${availableFormatted} tokens approved. Trying to stake ${stakeAmount}.`
        );
        return;
      }

      setIsStaking(true);
      await stakeTokens(writeContract, amountWei);
      toast.success("Staking transaction submitted!");
    } catch (err) {
      console.error("Error staking tokens: ", err);
      setError("Error staking tokens. Please try again.");
      setIsStaking(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !writeContract) return;

    try {
      setError(null);
      setIsWithdrawing(true);

      const amountWei = parseUnits(withdrawAmount, 18);
      await withdrawTokens(writeContract, amountWei);

      toast.success("Withdrawal transaction submitted!");
    } catch (err) {
      console.error("Error withdrawing tokens: ", err);
      setError("Error withdrawing tokens. Please try again.");
      setIsWithdrawing(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!writeContract) return;

    try {
      setError(null);
      setIsClaiming(true);

      await getReward(writeContract);
      toast.success("Claim rewards transaction submitted!");
    } catch (err) {
      console.error("Error claiming rewards: ", err);
      setError("Error claiming rewards. Please try again.");
      setIsClaiming(false);
    }
  };

  const handleSetDuration = async () => {
    if (!newDuration || !writeContract) return;

    try {
      setError(null);
      setIsSettingDuration(true);

      // Convert days to seconds
      const durationInSeconds = parseInt(newDuration) * 24 * 60 * 60;
      await setRewardsDuration(writeContract, durationInSeconds);
      toast.success("Set rewards duration transaction submitted!");
    } catch (err) {
      console.error("Error setting rewards duration: ", err);
      setError("Error setting rewards duration. Please try again.");
      setIsSettingDuration(false);
    }
  };

  const handleNotifyReward = async () => {
    if (!rewardAmount || !writeContract) return;

    try {
      setError(null);
      setIsNotifyingReward(true);

      const amountWei = parseUnits(rewardAmount, 18);
      await notifyRewardAmount(writeContract, rewardAmount);
      toast.success("Notify reward amount transaction submitted!");
    } catch (err) {
      console.error("Error notifying reward amount: ", err);
      setError("Error notifying reward amount. Please try again.");
      setIsNotifyingReward(false);
    }
  };

  const formatAddress = (address) => {
    if (!address) return "-";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="w-full h-full">
      {isLoading ? (
        <div className="w-full h-32 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <LoadingDots width="w-4" height="h-4" />
            <Text variant="extraSmall" color="secondary" className="uppercase">
              Loading staking data...
            </Text>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-start justify-start px-5 gap-4">
          {/* Staking Info Section */}
          <div className="w-full bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <Text variant="h4" weight="semibold" className="mb-4">
              Staking Information
            </Text>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <Text variant="small" color="secondary">
                  Your Staked Balance
                </Text>
                <Text variant="body" weight="medium">
                  {formatTokenAmount(stakedBalance)} Tokens
                </Text>
              </div>

              <div className="flex flex-col gap-1">
                <Text variant="small" color="secondary">
                  Earned Rewards
                </Text>
                <Text variant="body" weight="medium">
                  {formatTokenAmount(earnedTokens)} Tokens
                </Text>
              </div>

              <div className="flex flex-col gap-1">
                <Text variant="small" color="secondary">
                  Approved Tokens
                </Text>
                <Text
                  variant="body"
                  weight="medium"
                  className="text-green-600 dark:text-green-400"
                >
                  {formatTokenAmount(currentAllowance)} Tokens
                </Text>
              </div>

              <div className="flex flex-col gap-1">
                <Text variant="small" color="secondary">
                  Total Staked
                </Text>
                <Text variant="body" weight="medium">
                  {formatTokenAmount(totalStaked)} Tokens
                </Text>
              </div>

              <div className="flex flex-col gap-1">
                <Text variant="small" color="secondary">
                  Staking Period
                </Text>
                <Text variant="body" weight="medium">
                  {stakingPeriod || "-"} Days
                </Text>
              </div>

              <div className="flex flex-col gap-1">
                <Text variant="small" color="secondary">
                  Reward Rate
                </Text>
                <Text variant="body" weight="medium">
                  {formatTokenAmount(rewardRate)} Tokens/sec
                </Text>
              </div>

              <div className="flex flex-col gap-1">
                <Text variant="small" color="secondary">
                  Rewards End Date
                </Text>
                <Text variant="body" weight="medium">
                  {finishTime || "-"}
                </Text>
              </div>

              <div className="flex flex-col gap-1">
                <Text variant="small" color="secondary">
                  Contract Owner
                </Text>
                <Text variant="body" weight="medium">
                  {formatAddress(contractOwner)}
                </Text>
              </div>

              <div className="flex flex-col gap-1">
                <Text variant="small" color="secondary">
                  Staking Token
                </Text>
                <Text variant="body" weight="medium">
                  {formatAddress(stakingTokenAddress)}
                </Text>
              </div>

              <div className="flex flex-col gap-1">
                <Text variant="small" color="secondary">
                  Rewards Token
                </Text>
                <Text variant="body" weight="medium">
                  {formatAddress(rewardsTokenAddress)}
                </Text>
              </div>

            </div>
          </div>

          <Divider className="w-full h-px bg-gray-200 dark:bg-gray-700 my-2" />

          {/* Admin Section - Only show if user is owner */}
          {/* {isOwner && ( */}
          <>
            <div className="w-full bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
              <Text
                variant="h4"
                weight="semibold"
                className="mb-4 text-red-700 dark:text-red-400"
              >
                Admin Controls
              </Text>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Set Rewards Duration */}
                <div className="flex flex-col gap-3">
                  <Text variant="h5" weight="medium">
                    Set Rewards Duration
                  </Text>
                  <Text variant="small" color="secondary">
                    Current duration: {stakingPeriod || "-"} days
                  </Text>
                  <Input
                    type="number"
                    placeholder="Duration in days"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                  />
                  <Button
                    variant="default"
                    onClick={handleSetDuration}
                    disabled={!newDuration || isSettingDuration || !address}
                    className="w-full"
                  >
                    {isSettingDuration ? "Setting..." : "Set Duration"}
                  </Button>
                </div>

                {/* Notify Reward Amount */}
                <div className="flex flex-col gap-3">
                  <Text variant="h5" weight="medium">
                    Notify Reward Amount
                  </Text>
                  <Text variant="small" color="secondary">
                    Current rate: {formatTokenAmount(rewardRate)} tokens/sec
                  </Text>
                  <Input
                    type="text"
                    placeholder="Total reward amount"
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(e.target.value)}
                  />
                  <Button
                    variant="default"
                    onClick={handleNotifyReward}
                    disabled={!rewardAmount || isNotifyingReward || !address}
                    className="w-full"
                  >
                    {isNotifyingReward ? "Notifying..." : "Notify Rewards"}
                  </Button>
                </div>
              </div>

              {/* Admin Instructions */}
              <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                <Text
                  variant="small"
                  weight="medium"
                  className="text-yellow-800 dark:text-yellow-200 mb-2"
                >
                  Admin Setup Instructions:
                </Text>
                <div className="space-y-1">
                  <Text variant="extraSmall" color="secondary">
                    1. Contract has {formatTokenAmount(contractRewardBalance)}{" "}
                    reward tokens available
                  </Text>
                  <Text variant="extraSmall" color="secondary">
                    2. Set rewards duration (e.g., 30 days)
                  </Text>
                  <Text variant="extraSmall" color="secondary">
                    3. Notify reward amount (must be less or equal to the available reward tokens)
                  </Text>
                  <Text variant="extraSmall" color="secondary">
                    4. Users will start earning rewards immediately
                  </Text>
                </div>

                {Number(formatTokenAmount(contractRewardBalance)) === 0 && (
                  <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 rounded border border-red-300 dark:border-red-700">
                    <Text
                      variant="extraSmall"
                      className="text-red-700 dark:text-red-300"
                    >
                      ⚠️ No reward tokens in contract. Transfer reward tokens
                      first.
                    </Text>
                  </div>
                )}
              </div>
            </div>

            <Divider className="w-full h-px bg-gray-200 dark:bg-gray-700 my-2" />
          </>
          {/* )} */}

          {/* Staking Actions Section */}
          <div className="w-full">
            <Text variant="h4" weight="semibold" className="mb-4">
              Staking Actions
            </Text>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Approve Tokens */}
              <div className="flex flex-col gap-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <Text variant="h5" weight="medium">
                  1. Approve Tokens
                </Text>
                <Text variant="small" color="secondary">
                  Currently approved: {formatTokenAmount(currentAllowance)}{" "}
                  Tokens
                </Text>
                <Input
                  type="text"
                  placeholder="Amount to approve"
                  value={approveAmount}
                  onChange={(e) => setApproveAmount(e.target.value)}
                />
                <Button
                  variant="default"
                  onClick={handleApprove}
                  disabled={!approveAmount || isApproving || !address}
                  className="w-full"
                >
                  {isApproving ? "Approving..." : "Approve Tokens"}
                </Button>
              </div>

              {/* Stake Tokens */}
              <div className="flex flex-col gap-3 bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <Text variant="h5" weight="medium">
                  2. Stake Tokens
                </Text>
                <Text variant="small" color="secondary">
                  Available to stake: {formatTokenAmount(currentAllowance)}{" "}
                  Tokens
                </Text>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Amount to stake"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={handleMaxStake}
                    disabled={!currentAllowance || isStaking || !address}
                    className="px-3"
                  >
                    Max
                  </Button>
                </div>
                <Button
                  variant="default"
                  onClick={handleStake}
                  disabled={!stakeAmount || isStaking || !address}
                  className="w-full"
                >
                  {isStaking ? "Staking..." : "Stake Tokens"}
                </Button>
                <Text
                  variant="extraSmall"
                  color="secondary"
                  className="text-center"
                >
                  Tip: Use "Max" button to stake your full approved amount
                </Text>
              </div>

              {/* Withdraw Tokens */}
              <div className="flex flex-col gap-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                <Text variant="h5" weight="medium">
                  3. Withdraw Tokens
                </Text>
                <Text variant="small" color="secondary">
                  Staked: {formatTokenAmount(stakedBalance)} Tokens
                </Text>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Amount to withdraw"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={handleMaxWithdraw}
                    disabled={!stakedBalance || isWithdrawing || !address}
                    className="px-3"
                  >
                    Max
                  </Button>
                </div>
                <Button
                  variant="default"
                  onClick={handleWithdraw}
                  disabled={!withdrawAmount || isWithdrawing || !address}
                  className="w-full"
                >
                  {isWithdrawing ? "Withdrawing..." : "Withdraw Tokens"}
                </Button>
                <Text
                  variant="extraSmall"
                  color="secondary"
                  className="text-center"
                >
                  Tip: Use "Max" button to withdraw all staked tokens
                </Text>
              </div>
            </div>

            {/* Claim Rewards Section */}
            <div className="mt-6">
              <div className="flex flex-col gap-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <div className="flex flex-row justify-between items-center">
                  <Text variant="h5" weight="medium">
                    Claim Rewards
                  </Text>
                  <Text
                    variant="body"
                    className="text-purple-600 dark:text-purple-400"
                  >
                    Available: {formatTokenAmount(earnedTokens)} Tokens
                  </Text>
                </div>
                <Button
                  variant="default"
                  onClick={handleClaimRewards}
                  disabled={
                    !earnedTokens ||
                    Number(earnedTokens) <= 0 ||
                    isClaiming ||
                    !address
                  }
                  className="w-full"
                >
                  {isClaiming ? "Claiming..." : "Claim Rewards"}
                </Button>
              </div>
            </div>

            {/* Helper Information */}
            <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <Text variant="h5" weight="medium" className="mb-3">
                How Staking Works:
              </Text>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <Text variant="small" color="secondary">
                    First, approve the amount of tokens you want to stake
                  </Text>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <Text variant="small" color="secondary">
                    Then, stake your approved tokens to start earning rewards
                  </Text>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <Text variant="small" color="secondary">
                    Withdraw your staked tokens anytime (rewards continue until
                    claimed)
                  </Text>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  <Text variant="small" color="secondary">
                    Claim your earned rewards separately - you can claim even
                    after rewards period ends
                  </Text>
                </div>
              </div>
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="w-full p-3 bg-red-100 dark:bg-red-900/30 rounded-lg mt-4">
              <Text variant="body" color="error" align="center">
                {error}
              </Text>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StakingContract;
