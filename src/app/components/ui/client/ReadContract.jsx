import React, { useState, useEffect } from "react";
import { Text, Button, Input, Loader, LoadingDots } from "../common";
import {
  // getTokenName,
  getTokenSymbol,
  getTokenDecimals,
  getTotalSupply,
  getBalanceOf,
  getOwner,
  getAllowance,
} from "../../../services/contractServices.js";
import { formatUnits } from "ethers";

export const ReadContract = ({
  isConfirmed,
  address,
  publicClient,
  chainId,
}) => {
  // States for storing data
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState(null);
  const [totalSupply, setTotalSupply] = useState("");
  const [owner, setOwner] = useState("");
  const [balance, setBalance] = useState("");

  // Loading states
  const [isLoading, setIsLoading] = useState(true);

  // Allowance states
  const [allowance, setAllowance] = useState("");
  const [allowanceOwner, setAllowanceOwner] = useState("");
  const [allowanceSpender, setAllowanceSpender] = useState("");
  const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);
  
  // Error state
  const [error, setError] = useState(null);

  const fetchTokenData = async () => {
    if (!publicClient) return;

    setIsLoading(true);
    setError(null);

    try {
      // Token Name
      // const name = await getTokenName(publicClient);
      // if (name) {
      //   setTokenName(name);
      // }

      // Token symbol
      const symbol = await getTokenSymbol(publicClient);
      if (symbol) {
        setTokenSymbol(symbol);
      }

      // Token decimals
      const decimals = await getTokenDecimals(publicClient);
      if (decimals) {
        setTokenDecimals(decimals);
      }

      // Total supply
      const supply = await getTotalSupply(publicClient);
      if (supply && decimals) {
        const formattedTotalSupply = formatUnits(supply, decimals);
        const trimmed =
          formattedTotalSupply.slice(0, 10) +
          "..." +
          formattedTotalSupply.slice(-10);
        setTotalSupply(trimmed);
      }

      // Contract owner
      const ownerAddress = await getOwner(publicClient);
      if (ownerAddress) {
        const trimmedAddress = ownerAddress.slice(0, 6) + "..." + ownerAddress.slice(-4);
        setOwner(trimmedAddress);
      }

      // User balance (only if address is provided)
      if (address) {
        try {
          const userBalance = await getBalanceOf(publicClient, address);
          if (userBalance && decimals) {
            const formattedBalance = formatUnits(userBalance, decimals);
            setBalance(formattedBalance);
          }
        } catch (err) {
          console.error("Error fetching balance: ", err);
          // Don't set global error for balance issues, just log it
        }
      }
    } catch (err) {
      console.error("Error fetching token data: ", err);
      setError("Error fetching token data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkAllowance = async () => {
    if (!publicClient || !allowanceSpender || !allowanceOwner || !tokenDecimals)
      return;

    setIsCheckingAllowance(true);
    setError(null);

    try {
      const allowanceValue = await getAllowance(
        publicClient,
        allowanceOwner,
        allowanceSpender
      );

      if (allowanceValue !== undefined) {
        const formatted = formatUnits(allowanceValue, tokenDecimals);
        setAllowance(formatted);
      }
    } catch (err) {
      console.error("Error fetching allowance", err);
      setError("Error fetching allowance. Please check the addresses and try again.");
    } finally {
      setIsCheckingAllowance(false);
    }
  };

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchTokenData();
  }, [publicClient, address]);

  // Refetch data when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      fetchTokenData();
    }
  }, [isConfirmed]);

  return (
    <div className="w-full h-full">
      {isLoading ? (
        // Loading state
        <div className="w-full h-32 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <LoadingDots width="w-4" height="h-4"/>
            <Text variant="extraSmall" color="secondary" className="uppercase">
              Loading contract data...
            </Text>
          </div>
        </div>
      ) : (
        // Read Contract Section
        <div className="w-full flex flex-col items-start justify-start px-5 gap-4">
          <div className="flex flex-col items-start justify-center">
            {/* <div className="flex items-center justify-center gap-2">
              <Text variant="h5" weight="body" color='body'>
                Name:
              </Text>
              <Text variant="body">{tokenName || "-"}</Text>
            </div> */}
            <div className="flex items-center justify-center gap-2">
              <Text variant="h5" weight="body" color='body'>
                Decimals:
              </Text>
              <Text variant="body">{tokenDecimals !== null ? tokenDecimals : "-"}</Text>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Text variant="h5" weight="body" color='body'>
                Symbol:
              </Text>
              <Text variant="body">{tokenSymbol || "-"}</Text>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Text variant="h5" weight="body" color='body'>
                Balance:
              </Text>
              <Text variant="body">
                {address ? `${balance || "0"} ${tokenSymbol || ""}` : "Connect wallet to view"}
              </Text>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Text variant="h5" weight="body" color='body'>
                Total Supply:
              </Text>
              <Text variant="body">
                {totalSupply || "-"} {tokenSymbol || ""}
              </Text>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Text variant="h5" weight="body" color='body'>
                Owner Address:
              </Text>
              <Text variant="body">{owner || "-"}</Text>
            </div>

            {/* Check Allowance Section */}
            <div className="flex flex-col items-start gap-2.5 mt-4 w-full">
              <Text variant="h5" weight="body" color='body'>
                Check Allowance:
              </Text>
              <Input
                type="text"
                placeholder="Owner address"
                value={allowanceOwner}
                onChange={(e) => setAllowanceOwner(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Spender address"
                value={allowanceSpender}
                onChange={(e) => setAllowanceSpender(e.target.value)}
              />
              <div className="flex flex-col items-start justify-center w-full gap-2.5">
                <Button
                  variant="default"
                  onClick={checkAllowance}
                  disabled={
                    !allowanceOwner ||
                    !allowanceSpender ||
                    isCheckingAllowance
                  }
                >
                  Check Allowance
                </Button>
                
                {isCheckingAllowance ? (
                  <div className="flex items-center gap-2 mt-2">
                    <LoadingDots width="w-3" height="h-3" />
                    <Text variant="small" color="secondary">Checking allowance...</Text>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2.5 mt-2">
                    <Text variant="h5" weight="body" color='body'>
                      Allowance:
                    </Text>
                    <Text variant="body">
                      {allowance || "0"} {tokenSymbol || ""}
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="w-full p-3 bg-red-100 dark:bg-red-900/20 rounded-lg mt-4">
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