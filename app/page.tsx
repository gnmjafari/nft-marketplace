"use client";
import { NextPage } from "next";
import { BaseLayout, NftList } from "@ui";
import { useNetwork } from "@/components/hooks/web3/useNetwork";

const Home: NextPage = () => {
  const { network } = useNetwork();

  console.log("useNetwork()", useNetwork());

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
        {network.isConnectedToNetwork ? (
          <NftList />
        ) : (
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
        )}
      </div>
    </BaseLayout>
  );
};

export default Home;
