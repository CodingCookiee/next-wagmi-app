import stakingAbi from "../abi/stakingAbi.json";
import abi from "../abi/abi.json";

const STAKING_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS;
const TOKEN_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS;

// Read Contract Functions
export const getBalanceOf = async (publicClient, address) => {
  if (!address) throw new Error("Address is required");

  try {
    const data = await publicClient.readContract({
      address: STAKING_CONTRACT_ADDRESS,
      abi: stakingAbi,
      functionName: "balanceOf",
      args: [address],
    });
    return data;
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw error;
  }
};

export const getStakingPeriod = async (publicClient) => {
  try {
    const data = await publicClient.readContract({
      address: STAKING_CONTRACT_ADDRESS,
      abi: stakingAbi,
      functionName: "duration",
    });

    return data;
  } catch (error) {
    console.error("Error fetching staking period:", error);
    throw error;
  }
};

export const getTokenEarned = async (publicClient, address) => {
  if (!address) throw new Error("Address is required");

  try {
    const data = await publicClient.readContract({
      address: STAKING_CONTRACT_ADDRESS,
      abi: stakingAbi,
      functionName: "earned",
      args: [address],
    });
    return data;
  } catch (error) {
    console.error("Error fetching token earned:", error);
    throw error;
  }
};

export const getFinishTime = async (publicClient) => {
  try {
    const data = await publicClient.readContract({
      address: STAKING_CONTRACT_ADDRESS,
      abi: stakingAbi,
      functionName: "finishAt",
    });
    return data;
  } catch (error) {
    console.error("Error fetching finish time:", error);
    throw error;
  }
};

export const getLastTimeRewardApplicable = async (publicClient) => {
  try {
    const data = await publicClient.readContract({
      address: STAKING_CONTRACT_ADDRESS,
      abi: stakingAbi,
      functionName: "lastTimeRewardApplicable",
    });
    return data;
  } catch (error) {
    console.error("Error fetching last time reward applicable:", error);
    throw error;
  }
};

export const getOwner = async (publicClient) => {
  try {
    const data = await publicClient.readContract({
      address: STAKING_CONTRACT_ADDRESS,
      abi: stakingAbi,
      functionName: "owner",
    });
    return data;
  } catch (error) {
    console.error("Error fetching owner:", error);
    throw error;
  }
};

export const getRewardPerToken = async (publicClient) => {
  try {
    const data = await publicClient.readContract({
      address: STAKING_CONTRACT_ADDRESS,
      abi: stakingAbi,
      functionName: "rewardPerToken",
    });
    return data;
  } catch (error) {
    console.error("Error fetching reward per token:", error);
    throw error;
  }
};

export const getRewardPerTokenStored = async (publicClient) => {
  try {
    const data = await publicClient.readContract({
      address: STAKING_CONTRACT_ADDRESS,
      abi: stakingAbi,
      functionName: "rewardPerTokenStored",
    });
    return data;
  } catch (error) {
    console.error("Error fetching reward per token stored:", error);
    throw error;
  }
};

export const getRewardRate = async (publicClient) => {
  try {
    const data = await publicClient.readContract({
      address: STAKING_CONTRACT_ADDRESS,
      abi: stakingAbi,
      functionName: "rewardRate",
    });
    return data;
  } catch (error) {
    console.error("Error fetching reward rate:", error);
    throw error;
  }
};

export const getRewards = async (publicClient, address) => {
  if (!address) throw new Error("Address is required");

  try {
    const data = await publicClient.readContract({
      address: STAKING_CONTRACT_ADDRESS,
      abi: stakingAbi,
      functionName: "rewards",
      args: [address],
    });
    return data;
  } catch (error) {
    console.error("Error fetching rewards:", error);
    throw error;
  }
};

export const getRewardsToken = async (publicClient) => {
  try {
    const data = await publicClient.readContract({
      address: STAKING_CONTRACT_ADDRESS,
      abi: stakingAbi,
      functionName: "rewardsToken",
    });
    return data;
  } catch (error) {
    console.error("Error fetching rewards token:", error);
    throw error;
  }
};

export const getStakingToken = async (publicClient) => {
  try {
    const data = await publicClient.readContract({
      address: STAKING_CONTRACT_ADDRESS,
      abi: stakingAbi,
      functionName: "stakingToken",
    });
    return data;
  } catch (error) {
    console.error("Error fetching staking token:", error);
    throw error;
  }
};

export const getTotalSupply = async (publicClient) => {
  try {
    const data = await publicClient.readContract({
      address: STAKING_CONTRACT_ADDRESS,
      abi: stakingAbi,
      functionName: "totalSupply",
    });
    return data;
  } catch (error) {
    console.error("Error fetching total supply:", error);
    throw error;
  }
};

export const getUserRewardPerTokenPaid = async (publicClient, address) => {
  if (!address) throw new Error("Address is required");

  try {
    const data = await publicClient.readContract({
      address: STAKING_CONTRACT_ADDRESS,
      abi: stakingAbi,
      functionName: "userRewardPerTokenPaid",
      args: [address],
    });
    return data;
  } catch (error) {
    console.error("Error fetching user reward per token paid:", error);
    throw error;
  }
};

// Write Contract Functions
export const approveStakingContract = async (writeContract, stakingTokenAddress, amount) => {
  if (!amount) throw new Error("Amount is required");
  if (!stakingTokenAddress) throw new Error("Staking token address is required");
  
  try {
    return writeContract({
      address: stakingTokenAddress,
      abi: abi,
      functionName: "approve",
      args: [STAKING_CONTRACT_ADDRESS, amount],
    });
  } catch (error) {
    console.error("Error approving stake tokens", error);
    throw error;
  }
};


export const stakeTokens = async (writeContract, amount) => {
  if (!amount) throw new Error("Amount is required");

  try {
    return writeContract({
      address: STAKING_CONTRACT_ADDRESS,
      abi: stakingAbi,
      functionName: "stake",
      args: [amount],
    });
  } catch (error) {
    console.error("Error staking tokens", error);
  }
};

export const withdrawTokens = async (writeContract, amount) => {
  if (!amount) throw new Error("Amount is required");

  try {
    return writeContract({
      address: STAKING_CONTRACT_ADDRESS,
      abi: stakingAbi,
      functionName: "withdraw",
      args: [amount],
    });
  } catch (error) {
    console.error("Error unstaking tokens", error);
  }
};

export const getReward = async (writeContract) => {
  try {
    return writeContract({
      address: STAKING_CONTRACT_ADDRESS,
      abi: stakingAbi,
      functionName: "getReward",
    });
  } catch (error) {
    console.error("Error claiming rewards", error);
  }
};

export const notifyRewardAmount = async (writeContract, amount) => {
  if (!amount) throw new Error("Amount is required");

  try {
    return writeContract({
      address: STAKING_CONTRACT_ADDRESS,
      abi: stakingAbi,
      functionName: "notifyRewardAmount",
      args: [amount],
    });
  } catch (error) {
    console.error("Error notifying reward amount", error);
  }
};

export const setRewardsDuration = async (writeContract, duration) => {
  if (!duration) throw new Error("Duration is required");

  try {
    return writeContract({
      address: STAKING_CONTRACT_ADDRESS,
      abi: stakingAbi,
      functionName: "setRewardsDuration",
      args: [duration],
    });
  } catch (error) {
    console.error("Error setting rewards duration", error);
  }
};
