/* eslint-disable @typescript-eslint/no-explicit-any */
import { setupHooks, Web3Hooks } from "@/components/hooks/web3/setupHooks";
import { Web3Dependencies } from "@/types/hooks";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers, Contract } from "ethers";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type Web3State = {
  isLoading: boolean;
  hooks: Web3Hooks;
} & Nullable<Web3Dependencies>;

export const createDefaultState = () => {
  return {
    ethereum: null,
    provider: null,
    contract: null,
    isLoading: true,
    hooks: setupHooks({ isLoading: true } as any),
  };
};

export const createWeb3State = ({
  ethereum,
  provider,
  contract,
  isLoading,
}: Web3Dependencies & { isLoading: boolean }) => {
  return {
    ethereum,
    provider,
    contract,
    isLoading,
    hooks: setupHooks({ ethereum, provider, contract, isLoading }),
  };
};

const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

export const loadContract = async (
  name: string,
  provider: ethers.BrowserProvider
): Promise<Contract> => {
  if (!NETWORK_ID) {
    return Promise.reject("Network ID is not defined!");
  }

  const res = await fetch(`/contracts/${name}.json`);
  const Artifacts = await res.json();

  if (Artifacts.networks[NETWORK_ID].address) {
    const contract = new ethers.Contract(
      Artifacts.networks[NETWORK_ID].address,
      Artifacts.abi,
      provider
    );

    return contract;
  } else {
    return Promise.reject(`Contract: [${name}] cannot be loaded`);
  }
};
