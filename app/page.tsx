"use client";
import { NextPage } from "next";
import { BaseLayout, NftList } from "@ui";
import { useListedNfts } from "@/components/hooks/web3/useListedNfts";

const Home: NextPage = () => {
  const { nfts } = useListedNfts();
  console.log("nfts", nfts.data);

  // const { provider } = useWeb3();

  // const getNftInfo = async () => {
  //   if (!contract) {
  //     console.error("Contract is not initialized.");
  //     return;
  //   }

  //   try {
  //     const name = await contract.name();
  //     console.log("Contract Name:", name);

  //     const symbol = await contract.symbol();
  //     console.log("Contract Symbol:", symbol);
  //   } catch (error) {
  //     console.error("Error fetching NFT info:", error);
  //   }
  // };

  // if (contract) {
  //   getNftInfo();
  // }

  // const getAccount = async () => {
  //   const accounts = await provider!.listAccounts();
  //   console.log(accounts[0]);
  // };

  // if (provider) {
  //   getAccount();
  // }

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
        <NftList nfts={nfts.data} />
      </div>
    </BaseLayout>
  );
};

export default Home;
