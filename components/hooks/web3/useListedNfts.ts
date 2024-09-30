/* eslint-disable @typescript-eslint/no-explicit-any */
import { useHooks } from "@/components/providers/web3/web3";
import { CryptoHookFactory } from "@/types/hooks";
import { Nft } from "@/types/nft";
import { formatEther } from "ethers";
import useSWR from "swr";

type UseListedNftsResponse = object;

type ListedNftsHookFactory = CryptoHookFactory<Nft[], UseListedNftsResponse>;

export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>;

export const hookFactory: ListedNftsHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swr } = useSWR(
      contract ? "web3/useListedNfts" : null,
      async () => {
        const nfts = [] as Nft[];
        const coreNfts = await contract!.getAllNftsOnSale();

        console.log("coreNfts", coreNfts.length);

        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];
          const tokenURI = await contract!.tokenURI(item.tokenId);

          const metaRes = await fetch(tokenURI);

          console.log("metaRes", metaRes);

          const meta = await metaRes.json();
          console.log("ali", {
            price: parseFloat(formatEther(item.price)),
            tokenId: item.tokenId.toString(),
            creator: item.creator,
            isListed: item.isListed,
            meta,
          });
          nfts.push({
            price: parseFloat(formatEther(item.price)),
            tokenId: item.tokenId.toString(),
            creator: item.creator,
            isListed: item.isListed,
            meta,
          });
        }

        return nfts;
      }
    );

    return {
      ...swr,
      data: data || [],
    };
  };

export const useListedNfts = () => {
  const hooks = useHooks();
  const swrRes = hooks.useListedNfts();
  return {
    nfts: swrRes,
  };
};
