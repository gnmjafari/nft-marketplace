/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useWeb3 } from "@/components/providers/web3/web3";
import { nftMeta } from "@/types/nft";
import { BaseLayout } from "@ui";
import axios from "axios";
import { NextPage } from "next";
import { ChangeEvent, useState } from "react";

const NftCreate: NextPage = () => {
  const { ethereum } = useWeb3();
  const [nftMeta, setNftMeta] = useState<nftMeta>({
    name: "",
    description: "",
    image: "",
    attributes: [
      { trait_type: "attack", value: "0" },
      { trait_type: "health", value: "0" },
      { trait_type: "speed", value: "0" },
    ],
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setNftMeta({ ...nftMeta, [name]: value });
  };

  const handleAttributeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const attributesIdx = nftMeta.attributes.findIndex(
      (attr) => attr.trait_type === name
    );
    nftMeta.attributes[attributesIdx].value = value;

    setNftMeta({ ...nftMeta, attributes: nftMeta.attributes });
  };

  const getSignedData = async () => {
    const response = await axios.get("/api/verify");
    const accounts = (await ethereum?.request({
      method: "eth_requestAccounts",
    })) as string[];
    const account = accounts[0];

    const signedData = await ethereum?.request({
      method: "personal_sign",
      params: [JSON.stringify(response.data), account, response.data.id],
    });

    return { signedData, account };
  };

  const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.error("Select a file");
      return;
    }

    const file = e.target.files[0];
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    try {
      const { signedData, account } = await getSignedData();
      await axios.post(
        "/api/verify-image",
        JSON.stringify({
          address: account,
          signature: signedData,
          bytes,
          contentType: file.type,
          fileName: file.name.replace(/\.[^/.]$/, ""),
        })
      );
    } catch (error) {
      console.error("getSignedData ERR:", error);
    }

    console.log("bytes", bytes);
  };

  const createNft = async () => {
    try {
      const { signedData, account } = await getSignedData();

      await axios.post(
        "/api/verify",
        JSON.stringify({
          address: account,
          signature: signedData,
          nft: nftMeta,
        })
      );
    } catch (error: any) {
      console.error("createNft:", error.message);
    }
  };

  return (
    <BaseLayout>
      <div className="w-full flex justify-center items-center gap-5">
        <div className="card  bg-base-100 w-1/2 shadow-xl gap-3 p-5">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Name</span>
            </div>
            <input
              name="name"
              value={nftMeta.name}
              onChange={handleChange}
              type="text"
              placeholder="My NFT"
              className="input input-bordered w-full max-w-xs input-sm"
            />
          </label>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Description</span>
            </div>
            <textarea
              name="description"
              value={nftMeta.description}
              onChange={handleChange}
              rows={2}
              className="textarea textarea-bordered h-12"
              placeholder="some NFT description..."
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Image</span>
            </div>
            <input
              name="image"
              value={nftMeta.image}
              onChange={handleImage}
              type="file"
              className="file-input file-input-bordered w-full max-w-xs "
            />
          </label>
          <div className="flex justify-between items-center gap-5">
            {nftMeta.attributes.map((attribute, key) => {
              return (
                <label key={key} className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">{attribute.trait_type}</span>
                  </div>
                  <input
                    name={attribute.trait_type}
                    onChange={handleAttributeChange}
                    value={attribute.value}
                    type="text"
                    className="input input-bordered w-full max-w-xs input-sm"
                  />
                </label>
              );
            })}
          </div>
          <div className="flex items-center justify-between gap-5">
            <div className="form-control w-72">
              <label className="label cursor-pointer">
                <input
                  type="checkbox"
                  className="toggle toggle-accent"
                  defaultChecked
                />
                <span className="label-text">
                  Do you have meta data already ?
                </span>
              </label>
            </div>
            <button
              onClick={createNft}
              className="btn w-20 btn-primary ml-auto mt-2"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default NftCreate;
