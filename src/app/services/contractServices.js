import abi from "../abi/abi.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

// Read Contract Functions
// export const getTokenName = async (publicClient) => {
//   try {
//     const data = await publicClient.readContract({
//       address: CONTRACT_ADDRESS,
//       abi,
//       functionName: "name",
//     });

//     return data;
//   } catch (error) {
//     console.error("Error fetching token name:", error);
//     throw error;
//   }
// };

export const getTokenSymbol = async (publicClient) => {
  try {
    const data = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "symbol",
    });

    return data;
  } catch (error) {
    console.error("Error fetching token symbol:", error);
    throw error;
  }
};

export const getTokenDecimals = async (publicClient) => {
  try {
    const data = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "decimals",
    });

    return data;
  } catch (error) {
    console.error("Error fetching token decimals:", error);
    throw error;
  }
};

export const getTotalSupply = async (publicClient) => {
  try {
    const data = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "totalSupply",
    });

    return data;
  } catch (error) {
    console.error("Error fetching total supply:", error);
    throw error;
  }
};

export const getOwner = async (publicClient) => {
  try {
    const data = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "owner",
    });

    return data;
  } catch (error) {
    console.error("Error fetching contract owner:", error);
    throw error;
  }
};

export const getBalanceOf = async (publicClient, address) => {
  if (!address) throw new Error("Address is required");

  try {
    const data = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "balanceOf",
      args: [address],
    });

    return data;
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw error;
  }
};

export const getAllowance = async (publicClient, owner, spender) => {
  if (!owner || !spender)
    throw new Error("Owner and spender addresses are required");

  try {
    const data = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "allowance",
      args: [owner, spender],
    });

    return data;
  } catch (error) {
    console.error("Error fetching allowance:", error);
    throw error;
  }
};

// Write Contract Functions
export const mintTokens = async (writeContract, amount) => {
  if (!amount) throw new Error("Address is required");

  try {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "mint",
      args: [amount],
    });
  } catch (error) {
    console.error("Error minting tokens", error);
  }
};

export const burnTokens = async (writeContract, amount) => {
  if (!amount) throw new Error("Amount is required");

  try {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "burn",
      args: [amount],
    });
  } catch (error) {
    console.error("Error burning tokens", error);
  }
};

export const approveTokens = async (writeContract, spender, amount) => {
  if (!amount || !spender)
    throw new Error("Spender address and amount is required");

  try {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "approve",
      args: [spender, amount],
    });
  } catch (error) {
    console.error("Error approving tokens", error);
  }
};

export const increaseAllowance = async (writeContract, spender, addedValue) => {
  if (!addedValue || !spender)
    throw new Error("Spender address and amount is required");

  try {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "increaseAllowance",
      args: [spender, addedValue],
    });
  } catch (error) {
    console.error("Error increasing allowance tokens", error);
  }
};

export const decreaseAllowance = async (
  writeContract,
  spender,
  subtractedValue
) => {
  if (!subtractedValue || !spender)
    throw new Error("Spender address and amount is required");

  try {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "decreaseAllowance",
      args: [spender, subtractedValue],
    });
  } catch (error) {
    console.error("Error decreasing allowance tokens", error);
  }
};

export const transfer = async (writeContract, recipient, amount) => {
  if (!recipient || !amount)
    throw new Error("Recipient address and amount is required");

  try {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "transfer",
      args: [recipient, amount],
    });
  } catch (error) {
    console.error("Error transferring amount", error);
  }
};

export const transferFrom = async (
  writeContract,
  sender,
  recipient,
  amount
) => {
  if (!recipient || !sender || !amount)
    throw new Error(
      "Recipient address, sender address, and amount is required"
    );

  try {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "transferFrom",
      args: [sender, recipient, amount],
    });
  } catch (error) {
    console.error(
      `Error transferring amount from ${sender} to ${recipient}", ${error}`
    );
  }
};
