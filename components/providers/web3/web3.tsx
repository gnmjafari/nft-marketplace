"use client";
import {
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { createDefaultState, Web3State } from "./utils";
import { ethers } from "ethers";

type props = {
  children: ReactNode;
};

const Web3Context = createContext<Web3State>(createDefaultState());

export const Web3Provider: FunctionComponent<props> = ({ children }) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());

  useEffect(() => {
    async function initWeb3() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider = new ethers.BrowserProvider(window.ethereum as any);

      const signer = await provider.getSigner();
      console.log("Signer address:", await signer.getAddress());

      setWeb3Api({
        ethereum: window.ethereum,
        provider,
        contract: null,
        isLoading: false,
      });
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
