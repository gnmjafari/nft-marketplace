/* eslint-disable @typescript-eslint/no-explicit-any */
import { useHooks } from "@/components/providers/web3/web3";
import { CryptoHookFactory } from "@/types/hooks";
import { Nft } from "@/types/nft";
import { formatEther } from "ethers";
import useSWR from "swr";

type UseOwnedNftsResponse = object;

type OwnedNftsHookFactory = CryptoHookFactory<Nft[], UseOwnedNftsResponse>;

export type UseOwnedNftsHook = ReturnType<OwnedNftsHookFactory>;

export const hookFactory: OwnedNftsHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swr } = useSWR(
      contract ? "web3/useOwnedNfts" : null,
      async () => {
        const nfts = [] as Nft[];
        const coreNfts = await contract!.getOwnedNfts();

        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];
          const tokenURI = await contract!.tokenURI(item.tokenId);
          const metaRes = await fetch(tokenURI);
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

    return {
      ...swr,
      data: data || [],
    };
  };

export const useOwnedNfts = () => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedNfts();
  return {
    nfts: swrRes,
  };
};
