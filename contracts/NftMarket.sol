// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NftMarket is ERC721URIStorage {
    uint256 private _listedItems;
    uint256 private _tokenIds;

    struct NftItem {
        uint tokenId;
        uint price;
        address creator;
        bool isListed;
    }

    uint public listingPrice = 0.25 ether;

    mapping(string => bool) private _usedTokenURIs;
    mapping(uint => NftItem) private _idToNftItem;

    event NftItemCreated(
        uint tokenId,
        uint price,
        address creator,
        bool isListed
    );

    constructor() ERC721("CreaturesNFT", "CNFT") {}

    function tokenURIExist(string memory tokenURI) public view returns (bool) {
        return _usedTokenURIs[tokenURI] == true;
    }

    function createNftItem(uint tokenId, uint price) private {
        require(price > 0, "price most be at least 1 wei");
        _idToNftItem[tokenId] = NftItem(tokenId, price, msg.sender, true);
        emit NftItemCreated(tokenId, price, msg.sender, true);
    }

    function getNftItem(uint tokenId) public view returns (NftItem memory) {
        return _idToNftItem[tokenId];
    }

    function listedItemsCount() public view returns (uint) {
        return _listedItems;
    }

    function mintToken(
        string memory tokenURI,
        uint price
    ) public payable returns (uint) {
        require(!tokenURIExist(tokenURI), "Token URI already exists");
        require(msg.value == listingPrice, "Price must be equal listing price");

        _tokenIds++;
        _listedItems++;

        uint newTokenId = _tokenIds;

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _usedTokenURIs[tokenURI] = true;
        createNftItem(newTokenId, price);

        return newTokenId;
    }

    function buyNft(uint tokenId) public payable {
        uint price = _idToNftItem[tokenId].price;
        address owner = ERC721.ownerOf(tokenId);

        require(msg.sender != owner, "You already own this NFT");
        require(msg.value == price, "Please, submit the asking price");

        _idToNftItem[tokenId].isListed = false;
        _listedItems--;

        _transfer(owner, msg.sender, tokenId);
        payable(owner).transfer(msg.value);
    }
}
