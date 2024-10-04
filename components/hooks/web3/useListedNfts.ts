/* eslint-disable @typescript-eslint/no-explicit-any */
import { useHooks } from "@/components/providers/web3/web3";
import { CryptoHookFactory } from "@/types/hooks";
import { Nft } from "@/types/nft";
import { formatEther, parseEther } from "ethers";
import { useCallback } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";

type UseListedNftsResponse = {
  buyNft: (tokenId: number, value: number) => void;
};

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

        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];
          const tokenURI = await contract!.tokenURI(item.tokenId);

          const metaRes = await fetch(`/api/fetch?fetchUrl=${tokenURI}`);
          const meta = await metaRes.json();

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

    const _contract = contract;
    const buyNft = useCallback(
      async (tokenId: number, value: number) => {
        try {
          const result: any = await _contract!.buyNft(tokenId, {
            value: parseEther(value.toString()),
          });

          await toast.promise(result?.wait(), {
            pending: "Processing transaction",
            success: "Nft is yours! Go to profile page",
            error: "Processing error",
          });
        } catch (error: any) {
          console.error("buyNft:", error);
        }
      },
      [_contract]
    );

    return {
      ...swr,
      buyNft,
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
