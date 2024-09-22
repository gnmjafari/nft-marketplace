const NftMarket = artifacts.require("NftMarket");

contract("NftMarket", (accounts) => {
  let _contract = null;
  let _nftPrice = web3.utils.toWei("0.3", "ether");
  let _listingPrice = web3.utils.toWei("0.25", "ether");

  before(async () => {
    _contract = await NftMarket.deployed();
  });

  describe("Mint token", () => {
    const tokenURI = "https://test.com";

    before(async () => {
      await _contract.mintToken(tokenURI, _nftPrice, {
        from: accounts[0],
        value: _listingPrice,
      });
    });

    it("owner of the first token should be address[0]", async () => {
      const owner = await _contract.ownerOf(1);
      assert.equal(
        owner,
        accounts[0],
        "Owner of token is not matching address[0]"
      );
    });

    it("first token should point to the correct tokenURI", async () => {
      const actualTokenURI = await _contract.tokenURI(1);

      assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
    });

    it("should not be possible to create a NFT with used tokenURI", async () => {
      try {
        await _contract.mintToken(tokenURI, _nftPrice, {
          from: accounts[0],
        });
      } catch (error) {
        assert(error, "NFT was minted with previously used tokenURI");
      }
    });

    it("should have one listed item", async () => {
      const listedItem = await _contract.listedItemsCount();

      assert.equal(listedItem.toNumber(), 1, "listed items count is not 1");
    });

    it("should have create NFT item", async () => {
      const nftItem = await _contract.getNftItem(1);

      assert.equal(nftItem.tokenId, 1, "Token id is not one");
      assert.equal(nftItem.price, _nftPrice, "nft price is not correct");
      assert.equal(nftItem.creator, accounts[0], "creator is not account[0]");
      assert.equal(nftItem.isListed, true, "token is not listed");
    });
  });

  describe("Buy NFT", () => {
    before(async () => {
      await _contract.buyNft(1, {
        from: accounts[1],
        value: _nftPrice,
      });
    });

    it("should un list the item", async () => {
      const listedItem = await _contract.getNftItem(1);
      assert.equal(listedItem.isListed, false, "Item is still listed");
    });

    it("should decrease listed items count", async () => {
      const listedItemCount = await _contract.listedItemsCount();
      assert.equal(
        listedItemCount.toNumber(),
        0,
        "Count has not been decrement"
      );
    });

    it("should change the owner", async () => {
      const currentOwner = await _contract.ownerOf(1);
      assert.equal(currentOwner, accounts[1], "change the owner is wrong");
    });
  });
});
