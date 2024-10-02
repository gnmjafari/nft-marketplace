import { NftMarketContract } from "@/types/nftMarketContract";
import { Contract } from "ethers";
import { JsonRpcProvider } from "ethers";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import contract from "public/contracts/NftMarket.json";
import * as util from "ethereumjs-util";

export interface SessionData {
  message?: { contractAddress: string; id: string };
}

type addressCheckMiddlewareProps = {
  address: string;
  signature: string;
};

const NETWORKS = {
  "5777": "Ganache",
};

type NETWORK = typeof NETWORKS;

const abi = contract.abi;
const targetNetwork = process.env.NEXT_PUBLIC_NETWORK_ID as keyof NETWORK;

export const contractAddress = contract["networks"][targetNetwork]["address"];
export const pinataApiKey = process.env.PINATA_API_KEY as string;
export const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY as string;

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

export const addressCheckMiddleware = async (
  reqData: addressCheckMiddlewareProps
) => {
  return new Promise(async (resolve, reject) => {
    const { message } = await getIronSession<SessionData>(
      cookies(),
      sessionOptions
    );

    // access to contract
    const provider = new JsonRpcProvider("http://127.0.0.1:7545");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const contract = new Contract(
      contractAddress,
      abi,
      provider
    ) as unknown as NftMarketContract;
    // access to contract

    let nonce: string | Buffer =
      "\x19Ethereum Signed Message:\n" +
      JSON.stringify(message).length +
      JSON.stringify(message);

    nonce = util.keccak(Buffer.from(nonce, "utf-8"));
    const { v, r, s } = util.fromRpcSig(reqData.signature);
    const pubKey = util.ecrecover(util.toBuffer(nonce), v, r, s);
    const addrBuffer = util.pubToAddress(pubKey);
    const address = util.bufferToHex(addrBuffer);

    if (address === reqData.address) {
      resolve("Correct Address");
    } else {
      reject("Wrong Address");
    }
  });
};
