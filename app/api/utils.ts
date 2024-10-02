import { NftMarketContract } from "@/types/nftMarketContract";
import { Contract } from "ethers";
import { JsonRpcProvider } from "ethers";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import contract from "public/contracts/NftMarket.json";

export interface SessionData {
  message?: { contractAddress: string; id: string };
}

const NETWORKS = {
  "5777": "Ganache",
};

type NETWORK = typeof NETWORKS;

const abi = contract.abi;
const targetNetwork = process.env.NEXT_PUBLIC_NETWORK_ID as keyof NETWORK;

export const contractAddress = contract["networks"][targetNetwork]["address"];

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: "nft-auth-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const addressCheckMiddleware = async () => {
  return new Promise(async (resolve, reject) => {
    const { message } = await getIronSession<SessionData>(
      cookies(),
      sessionOptions
    );

    const provider = new JsonRpcProvider("http://127.0.0.1:7545");
    const contract = new Contract(
      contractAddress,
      abi,
      provider
    ) as unknown as NftMarketContract;

    const name = await contract.name();
    console.log("name:", name);

    if (message) {
      resolve("Correct Address");
    } else {
      reject("Wrong Address");
    }
  });
};
