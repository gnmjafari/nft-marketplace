import { FileReq } from "@/types/nft";
import { NextRequest } from "next/server";
import {
  addressCheckMiddleware,
  pinataApiKey,
  pinataSecretApiKey,
} from "../utils";
import FormData from "form-data";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { bytes, fileName, contentType, address, signature } =
      (await req.json()) as FileReq;

    if (!bytes || !fileName || !contentType) {
      return Response.json(
        { message: "Image data are missing" },
        { status: 422 }
      );
    }

    await addressCheckMiddleware({ address, signature });

    const buffer = Buffer.from(Object.values(bytes));
    const formData = new FormData();
    formData.append("file", buffer, {
      filename: fileName + "-" + uuidv4(),
      contentType,
    });

    const fileRes = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      }
    );

    return Response.json(fileRes.data, { status: 200 });
  } catch {
    return Response.json({ message: "Invalid endpoint" }, { status: 422 });
  }
}
