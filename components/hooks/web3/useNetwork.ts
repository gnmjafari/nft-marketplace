/* eslint-disable @typescript-eslint/no-explicit-any */
import { useHooks } from "@/components/providers/web3/web3";
import { CryptoHookFactory } from "@/types/hooks";
import useSWR from "swr";

const NETWORKS: { [k: string]: string } = {
  1: "Ethereum Main Network",
  3: "Ropsten Test Network",
  4: "Rinkeby Test Network",
  5: "Goerli Test Network",
  42: "Kovan Test Network",
  46: "Binance Smart Chain",
  1337: "Ganache",
  11155111: "Sepolia Test Network",
};

const targetId = process.env.NEXT_PUBLIC_TARGET_CHAIN_ID as string;
const targetNetwork = NETWORKS[targetId];

type UseNetworkResponse = {
  isLoading: boolean;
  isSupported: boolean;
  targetNetwork: string;
};

type NetworkHookFactory = CryptoHookFactory<any, UseNetworkResponse>;

export type UseNetworkHook = ReturnType<NetworkHookFactory>;

export const hookFactory: NetworkHookFactory =
  ({ provider, isLoading }) =>
  () => {
    const { data, isValidating, ...swr } = useSWR(
      provider ? "web3/useNetwork" : null,
      async () => {
        const chainId = (await provider?.getNetwork())?.chainId;
        if (!chainId) {
          throw "Cannot retrieve network. Please, refresh browser or connect to other one.";
        }
        return NETWORKS[chainId.toString()];
      },
      { revalidateOnFocus: false }
    );

    return {
      ...swr,
      data,
      isValidating,
      targetNetwork,
      isSupported: data === targetNetwork,
      isLoading: isLoading as boolean,
    };
  };

export const useNetwork = () => {
  const hooks = useHooks();
  const swrRes = hooks.useNetwork();
  return {
    network: swrRes,
  };
};
