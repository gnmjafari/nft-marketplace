export type Trait = "attack" | "health" | "speed";

export type nftAttributes = {
  trait_type: Trait;
  value: string;
};

export type nftMeta = {
  description: string;
  image: string;
  name: string;
  attributes: nftAttributes[];
};

export type NftCore = {
  tokenId: number;
  price: number;
  creator: string;
  isListed: boolean;
};

export type Nft = {
  meta: nftMeta;
} & NftCore;

export type FileReq = {
  bytes: Uint8Array;
  fileName: string;
  contentType: string;
  address: string;
  signature: string;
};

export type PinataRes = {
  IpfsHash: Uint8Array;
  PinSize: number;
  Timestamp: string;
  isDuplicate: boolean;
};
