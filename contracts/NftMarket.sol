// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NftMarket is ERC721URIStorage {
    uint256 private _listedItems;
    uint256 private _tokenIds;

    constructor() ERC721("CreaturesNFT", "CNFT") {}

    function mintToken(string memory tokenURI) public payable returns (uint) {
        _tokenIds++;
        _listedItems++;

        uint newTokenId = _tokenIds;

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        return newTokenId;
    }
}
