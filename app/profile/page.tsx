"use client";
import { useOwnedNfts } from "@/components/hooks/web3";
import { Nft } from "@/types/nft";
import { BaseLayout } from "@ui";
import { NextPage } from "next";
import { Fragment, useEffect, useState } from "react";

const Profile: NextPage = () => {
  const { nfts } = useOwnedNfts();
  const [activeNft, setActiveNft] = useState<Nft>();

  useEffect(() => {
    if (nfts.data && nfts.data.length > 0) {
      setActiveNft(nfts.data[0]);
    }

    return () => setActiveNft(undefined);
  }, [nfts.data]);

  return (
    <BaseLayout>
      <div className="card p-10 flex-row justify-center items-start gap-20">
        <div className="w-2/3">
          <div className="pl-10 pb-5 text-2xl">Your NFTs</div>
          <div className="ml-10 mb-5 border-b-2 w-28 pb-2 border-indigo-700 text-indigo-700 cursor-pointer">
            Your Collection
          </div>
          <div className="pl-10 max-w-lg mx-auto  grid gap-5 lg:grid-cols-3 lg:max-w-none">
            {(nfts.data as Nft[]).map((item, index) => {
              return (
                <div
                  className={`card bg-base-100 w-52 shadow-xl cursor-pointer ${
                    item.tokenId == activeNft?.tokenId
                      ? "border-4 border-indigo-700 p-2"
                      : ""
                  }`}
                  key={`${index}_${item.tokenId}`}
                  onClick={() => {
                    setActiveNft(item);
                  }}
                >
                  <figure>
                    <img src={item.meta.image} alt={item.meta.name} />
                  </figure>
                  <div className="card-body items-center justify-center p-1">
                    <h2 className="card-title text-ellipsis">
                      {item.meta.name}
                    </h2>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-1/3">
          {activeNft && (
            <div className="card bg-base-100 w-full shadow-xl">
              <figure>
                <img src={activeNft.meta.image} alt={activeNft.meta.name} />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{activeNft.meta.name}</h2>
                <p>{activeNft.meta.description}</p>
                <h2 className="card-title">Information</h2>
                <div className="divider my-1" />
                {activeNft.meta.attributes.map((attribute, key) => {
                  return (
                    <Fragment key={key}>
                      <p>
                        {attribute.trait_type}: {attribute.value}
                      </p>
                      <div className="divider my-1" />
                    </Fragment>
                  );
                })}

                <div className="flex justify-between items-center">
                  <button className="btn btn-primary">Download Image</button>
                  <button
                    disabled={activeNft.isListed}
                    onClick={() => {
                      nfts.listNft(activeNft.tokenId, activeNft.price);
                    }}
                    className={`btn btn-outline btn-primary ${
                      activeNft.isListed && "btn-disabled"
                    }`}
                  >
                    {activeNft.isListed ? "Nft is listed" : "List Nft"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseLayout>
  );
};

export default Profile;
