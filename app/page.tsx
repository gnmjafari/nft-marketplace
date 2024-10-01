"use client";
import { NextPage } from "next";
import { BaseLayout, NftList } from "@ui";

const Home: NextPage = () => {
  return (
    <BaseLayout>
      <div className="relative">
        <div className="text-center">
          <div className="text-3xl tracking-tight font-extrabold text-gray-300 sm:text-4xl">
            Amazing Creatures NFTs
          </div>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-400 sm:mt-4">
            Mint a NFT to get unlimited ownership forever!
          </p>
        </div>
        <NftList />
      </div>
    </BaseLayout>
  );
};

export default Home;
