/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useNetwork } from "@/components/hooks/web3/useNetwork";
import { useWeb3 } from "@/components/providers/web3/web3";
import { nftMeta, PinataRes } from "@/types/nft";
import { BaseLayout } from "@ui";
import axios from "axios";
import { parseEther } from "ethers";
import { NextPage } from "next";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";

const ALLOWED_FIELDS = ["name", "description", "image", "attributes"];

const NftCreate: NextPage = () => {
  const { ethereum, contract } = useWeb3();
  const { network } = useNetwork();
  const [nftURI, setNftURI] = useState<string>("");
  const [price, setPrice] = useState<string>("");

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
      const promise = axios.post(
        "/api/verify-image",
        JSON.stringify({
          address: account,
          signature: signedData,
          bytes,
          contentType: file.type,
          fileName: file.name.replace(/\.[^/.]$/, ""),
        })
      );
      const res = await toast.promise(promise, {
        pending: "Uploading image",
        success: "Image uploaded",
        error: "Image upload error",
      });
      const data = res.data as PinataRes;
      console.log("data", data);

      setNftMeta({
        ...nftMeta,
        image: `${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`,
      });
    } catch (error) {
      console.error("getSignedData ERR:", error);
    }
  };

  const uploadMetaData = async () => {
    try {
      const { signedData, account } = await getSignedData();

      const promise = axios.post(
        "/api/verify",
        JSON.stringify({
          address: account,
          signature: signedData,
          nft: nftMeta,
        })
      );
      const res = await toast.promise(promise, {
        pending: "Uploading metaData",
        success: "MetaData uploaded",
        error: "MetaData upload error",
      });
      const data = res.data as PinataRes;
      setNftURI(
        `${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`
      );
    } catch (error: any) {
      console.error("uploadMetaData:", error.message);
    }
  };

  const createNft = async () => {
    try {
      const nftRes = await fetch(`/api/fetch?fetchUrl=${nftURI}`);
      const content = await nftRes.json();

      Object.keys(content).forEach((key) => {
        if (!ALLOWED_FIELDS.includes(key)) {
          throw new Error("Invalid json structure");
        }
      });

      const tx: any = await contract?.mintToken(nftURI, parseEther(price), {
        value: parseEther((0.025).toString()),
      });

      await toast.promise(tx!.wait(), {
        pending: "NFT is being created",
        success: "NFT was created successfully",
        error: "There was a problem creating the NFT, please try again",
      });

      setNftURI("");
      setPrice("");
      setNftMeta({
        name: "",
        description: "",
        image: "",
        attributes: [
          { trait_type: "attack", value: "0" },
          { trait_type: "health", value: "0" },
          { trait_type: "speed", value: "0" },
        ],
      });
    } catch (error) {
      console.error("createNft:", error);
    }
  };

  if (!network.isConnectedToNetwork) {
    return (
      <BaseLayout>
        <div className="flex items-center justify-center mt-5">
          <div className="card bg-neutral text-neutral-content w-96">
            <div className="card-body items-center text-center">
              <h2 className="card-title">
                <span className="loading loading-ring loading-md" />
                Attention needed
                <span className="loading loading-ring loading-md" />
              </h2>

              {network.isLoading ? (
                <div className="card-actions justify-end">
                  <span className="loading loading-dots loading-lg" />
                </div>
              ) : (
                <div className="badge badge-warning badge-outline">
                  Please, Connect to {network.targetNetwork}
                </div>
              )}
            </div>
          </div>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <div className="w-full flex justify-center items-center gap-5">
        {!nftURI ? (
          <div className="card  bg-base-100 w-2/3 shadow-xl gap-3 p-5">
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
                // value={nftMeta.image}
                onChange={handleImage}
                type="file"
                className="file-input file-input-bordered w-full max-w-xs"
                src={nftMeta.image}
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
              {/* <div className="form-control w-72">
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
              </div> */}
              <button
                disabled={
                  !nftMeta.name ||
                  !nftMeta.description ||
                  !nftMeta.image ||
                  !nftMeta.attributes[0].value ||
                  !nftMeta.attributes[1].value ||
                  !nftMeta.attributes[2].value
                }
                onClick={uploadMetaData}
                className="btn w-20 btn-primary ml-auto mt-2"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="card  bg-base-100 w-2/3 shadow-xl gap-3 p-5">
            <div className="flex items-center">
              <h2 className="card-title">Your metaData :</h2>
              <button
                onClick={() => {
                  window.open(nftURI, "_blank");
                }}
                className="btn btn-link"
              >
                <h2 className="card-title">Link</h2>
              </button>
            </div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Price (ETH)</span>
              </div>
              <input
                name="price"
                typeof="number"
                value={price}
                onChange={(
                  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => {
                  setPrice(e.target.value);
                }}
                type="text"
                placeholder="Example 0.8"
                className="input input-bordered w-full max-w-xs input-sm"
              />
            </label>
            <button
              disabled={!price}
              onClick={createNft}
              className="btn w-20 btn-primary ml-auto mt-2"
            >
              List
            </button>
          </div>
        )}
        {nftMeta.image && !nftURI && (
          <div className="card  w-1/3 bg-base-100 shadow-xl">
            <figure>
              <img src={nftMeta.image} alt="nftImage" />
            </figure>
          </div>
        )}
      </div>
    </BaseLayout>
  );
};

export default NftCreate;
