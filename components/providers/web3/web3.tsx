/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createDefaultState,
  createWeb3State,
  loadContract,
  Web3State,
} from "./utils";
import { ethers } from "ethers";

type props = {
  children: ReactNode;
};

const Web3Context = createContext<Web3State>(createDefaultState());

export const Web3Provider: FunctionComponent<props> = ({ children }) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());

  useEffect(() => {
    async function initWeb3() {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        const contract = await loadContract("NftMarket", provider);

        setWeb3Api(
          createWeb3State({
            ethereum: window.ethereum,
            provider,
            contract,
            isLoading: false,
          })
        );
      } catch (error: any) {
        console.error("Please, install Web3 wallet");
        setWeb3Api((api) =>
          createWeb3State({ ...(api as any), isLoading: false })
        );
      }
    }
    initWeb3();
  }, []);

  return (
    <Web3Context.Provider value={web3Api}>{children}</Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};

export function useHooks() {
  const { hooks } = useWeb3();
  return hooks;
}
