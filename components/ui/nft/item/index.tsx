/* eslint-disable @next/next/no-img-element */
import { Nft } from "@/types/nft";
import React, { FunctionComponent } from "react";

type NftItemProps = {
  item: Nft;
};

const NftItem: FunctionComponent<NftItemProps> = ({ item }) => {
  return (
    <div className="card bg-base-100 w-80 shadow-xl">
      <figure>
        <img src={item.meta.image} alt="Shoes" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{item.meta.name}</h2>
        <p>{item.meta.description}</p>
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
          <button className="btn btn-sm btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default NftItem;
