import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";
import {
  addressCheckMiddleware,
  contractAddress,
  pinataApiKey,
  pinataSecretApiKey,
  SessionData,
  sessionOptions,
} from "../utils";
import { getIronSession } from "iron-session";
import { nftMeta } from "@/types/nft";
import { NextRequest } from "next/server";
import axios from "axios";

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  const message = { contractAddress, id: uuidv4() };
  session.message = message;
  await session.save();

  return Response.json(message);
}

export async function POST(req: NextRequest) {
  try {
    const reqData = await req.json();
    const nft = reqData.nft as nftMeta;

    if (!nft.name || !nft.description || !nft.attributes) {
      return Response.json(
        { message: "Some of the form data are missing!" },
        { status: 422 }
      );
    }

    await addressCheckMiddleware({
      address: reqData.address,
      signature: reqData.signature,
    });

    const jsonRes = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        pinataMetadata: {
          name: uuidv4(),
        },
        pinataContent: nft,
      },
      {
        headers: {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      }
    );

    return Response.json(jsonRes.data, { status: 200 });
  } catch {
    return Response.json({ message: "Cannot create JSON" }, { status: 422 });
  }
}
