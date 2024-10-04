/* eslint-disable @next/next/no-img-element */
import { Nft } from "@/types/nft";
import React, { FunctionComponent } from "react";

type NftItemProps = {
  item: Nft;
  buyNft: (tokenId: number, value: number) => void;
};

const NftItem: FunctionComponent<NftItemProps> = ({ item, buyNft }) => {
  const showAddress = (address: string) => {
    return `0x****${address.slice(-4)}`;
  };
  return (
    <div className="card bg-base-100 w-80 shadow-xl">
      <figure>
        <img src={item.meta.image} alt="Shoes" />
      </figure>
      <div className="card-body">
        <div className="flex items-center justify-start gap-3">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content w-8 rounded-full">
              <img src="/images/Avatar.png" alt="Avatar" />
            </div>
          </div>

          <span>Creator:</span>
          <div className="badge badge-primary badge-outline ml-auto">
            {showAddress(item.creator)}
          </div>
        </div>

        <h2 className="card-title">{item.meta.name}</h2>
        <p className="truncate ">{item.meta.description}</p>
        <div className="flex justify-between">
          <div className="flex flex-col py-4">
            <dt>Price</dt>
            <dd className="font-bold text-indigo-700">{item.price} ETH</dd>
          </div>
          {item.meta.attributes.map((attribute, key) => (
            <div key={key} className="flex flex-col py-4">
              <dt>{attribute.trait_type}</dt>
              <dd className="font-bold text-indigo-700">{attribute.value}</dd>
            </div>
          ))}
        </div>
        <div className="card-actions justify-start">
          <button
            onClick={() => {
              buyNft(item.tokenId, item.price);
            }}
            className="btn btn-sm btn-primary"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default NftItem;
