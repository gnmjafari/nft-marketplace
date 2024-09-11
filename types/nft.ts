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
