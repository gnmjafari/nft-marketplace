/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useHooks } from "@/components/providers/web3/web3";
import { CryptoHookFactory } from "@/types/hooks";
import useSWR from "swr";
import { JsonRpcSigner } from "ethers";

type UseAccountResponse = {
  connect: () => void;
  isLoading: boolean;
  isInstalled: boolean;
};

type AccountHookFactory = CryptoHookFactory<any, UseAccountResponse>;

export type UseAccountHook = ReturnType<AccountHookFactory>;

export const hookFactory: AccountHookFactory =
  ({ provider, ethereum, isLoading }) =>
  () => {
    const { data, mutate, isValidating, ...swr } = useSWR(
      provider ? "web3/useAccount" : null,
      async () => {
        const accounts = await provider!.listAccounts();
        const account = accounts[0];

        if (!account) {
          throw "Cannot retrieve account! Please, Connect to Web3 wallet";
        }
        return account;
      },
      { revalidateOnFocus: false, shouldRetryOnError: false }
    );

    const handleAccountChanged = (...args: unknown[]) => {
      const accounts = args[0] as unknown[];
      if (accounts.length === 0) {
        console.error("Please, connect to Web3 wallet");
      } else if (accounts[0] !== data?.address) {
        mutate(accounts[0] as JsonRpcSigner);
      }
    };

    useEffect(() => {
      ethereum?.on("accountsChanged", handleAccountChanged);

      return () => {
        ethereum?.removeListener("accountsChanged", handleAccountChanged);
      };
    });

    const connect = async () => {
      try {
        ethereum?.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.error("connect error:", error);
      }
    };
    return {
      ...swr,
      mutate,
      data: data?.address,
      isValidating,
      isLoading: isLoading as boolean,
      isInstalled: ethereum?.isMetaMask || false,
      connect,
    };
  };

export const useAccount = () => {
  const hooks = useHooks();
  const swrRes = hooks.useAccount();
  return {
    account: swrRes,
  };
};
