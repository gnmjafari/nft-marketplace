// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NftMarket is ERC721URIStorage {
    uint256 private _listedItems;
    uint256 private _tokenIds;

    mapping(string => bool) private _usedTokenURIs;

    constructor() ERC721("CreaturesNFT", "CNFT") {}

    function mintToken(string memory tokenURI) public payable returns (uint) {
        require(tokenURIExist(tokenURI), "Token URI already exists");

        _tokenIds++;
        _listedItems++;

        uint newTokenId = _tokenIds;

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _usedTokenURIs[tokenURI] = true;

        return newTokenId;
    }

    function tokenURIExist(string memory tokenURI) public view returns (bool) {
        return _usedTokenURIs[tokenURI] == true;
    }
}
