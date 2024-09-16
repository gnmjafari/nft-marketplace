/* eslint-disable @next/next/no-img-element */
import { nftMeta } from "@/types/nft";
import React, { FunctionComponent } from "react";

type NftItemProps = {
  item: nftMeta;
};

const NftItem: FunctionComponent<NftItemProps> = ({ item }) => {
  return (
    <div className="card bg-base-100 w-96 shadow-xl">
      <figure>
        <img src={item.image} alt="Shoes" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{item.name}</h2>
        <p>{item.description}</p>
        <div className="flex justify-between">
          {item.attributes.map((attribute, key) => (
            <div key={key} className="flex flex-col py-4">
              <dt>{attribute.trait_type}</dt>
              <dd>{attribute.value}</dd>
            </div>
          ))}
        </div>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default NftItem;
