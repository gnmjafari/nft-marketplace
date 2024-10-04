import React, { FunctionComponent } from "react";
import NftItem from "../item";
import { useListedNfts } from "@/components/hooks/web3/useListedNfts";

const NftList: FunctionComponent = () => {
  const { nfts } = useListedNfts();
  return (
    <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
      {nfts.data?.map((nft, key) => (
        <div
          key={key}
          className="flex flex-col items-center justify-center rounded-lg  overflow-hidden"
        >
          <NftItem item={nft} buyNft={nfts.buyNft} />
        </div>
      ))}
    </div>
  );
};

export default NftList;
