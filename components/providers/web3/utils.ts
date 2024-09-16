import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers, Contract } from "ethers";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

export type Web3Params = {
  ethereum?: MetaMaskInpageProvider | null;
  provider?: ethers.BrowserProvider | null;
  contract?: Contract | null;
};

export type Web3State = {
  isLoading: boolean;
} & Web3Params;

export const createDefaultState = () => {
  return {
    ethereum: null,
    provider: null,
    contract: null,
    isLoading: true,
  };
};
