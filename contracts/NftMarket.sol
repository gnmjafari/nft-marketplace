// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftMarket is ERC721URIStorage, Ownable {
    uint256 private _listedItems;
    uint256 private _tokenIds;
    uint256[] private _allNfts;

    uint public listingPrice = 0.025 ether;

    mapping(string => bool) private _usedTokenURIs;
    mapping(uint => NftItem) private _idToNftItem;
    mapping(uint => uint) private _idToNftIndex;
    mapping(address => mapping(uint => uint)) private _ownedTokens;
    mapping(uint => uint) private _idToOwnedIndex;

    struct NftItem {
        uint tokenId;
        uint price;
        address creator;
        bool isListed;
    }

    event NftItemCreated(
        uint tokenId,
        uint price,
        address creator,
        bool isListed
    );

    constructor()
        payable
        ERC721("CreaturesNFT", "CNFT")
        Ownable(_msgSender())
    {}

    function setListingPrice(uint newPrice) external onlyOwner {
        require(newPrice != 0, "price must be at least 1 wei");
        listingPrice = newPrice;
    }

    function tokenURIExist(string memory tokenURI) public view returns (bool) {
        return _usedTokenURIs[tokenURI] == true;
    }

    function totalSupply() public view returns (uint) {
        return _allNfts.length;
    }

    function tokenByIndex(uint index) public view returns (uint) {
        require(index < totalSupply(), "Index out of bounds");
        return _allNfts[index];
    }

    function tokenOfOwnerByIndex(
        address owner,
        uint index
    ) public view returns (uint) {
        require(index < ERC721.balanceOf(owner), "Index out of bounds");
        return _ownedTokens[owner][index];
    }

    function getAllNftsOnSale() public view returns (NftItem[] memory items) {
        uint allItemsCounts = totalSupply();
        uint currectIndex = 0;
        items = new NftItem[](_listedItems);

        for (uint256 index = 0; index < allItemsCounts; ++index) {
            uint tokenId = tokenByIndex(index);
            NftItem storage item = _idToNftItem[tokenId];

            if (item.isListed == true) {
                items[currectIndex] = item;
                currectIndex += 1;
            }
        }
    }

    function getOwnedNfts() public view returns (NftItem[] memory items) {
        uint ownedItemsCount = ERC721.balanceOf(_msgSender());
        items = new NftItem[](ownedItemsCount);

        for (uint i = 0; i < ownedItemsCount; ++i) {
            uint tokenId = tokenOfOwnerByIndex(_msgSender(), i);
            NftItem storage item = _idToNftItem[tokenId];
            items[i] = item;
        }
    }

    function createNftItem(uint tokenId, uint price) private {
        require(price != 0, "price most be at least 1 wei");

        _idToNftItem[tokenId].tokenId = tokenId;
        _idToNftItem[tokenId].price = price;
        _idToNftItem[tokenId].creator = msg.sender;
        _idToNftItem[tokenId].isListed = true;

        emit NftItemCreated(tokenId, price, msg.sender, true);
    }

    function placeNftOnSale(uint tokenId, uint newPrice) public payable {
        require(
            _ownerOf(tokenId) == _msgSender(),
            "you are not owner of this nft"
        );

        NftItem memory nftItem = _idToNftItem[tokenId];

        require(nftItem.isListed == false, "Item is already on sale");

        require(
            msg.value == listingPrice,
            "price must be equal to listing price"
        );

        _idToNftItem[tokenId].isListed = true;
        if (_idToNftItem[tokenId].price != newPrice) {
            _idToNftItem[tokenId].price = newPrice;
        }
        _listedItems = _listedItems + 1;
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
    ) public payable returns (uint newTokenId) {
        require(!tokenURIExist(tokenURI), "Token URI already exists");
        require(msg.value == listingPrice, "Invalid price");

        _tokenIds = _tokenIds + 1;
        _listedItems = _listedItems + 1;

        newTokenId = _tokenIds;

        _safeMint(_msgSender(), newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _usedTokenURIs[tokenURI] = true;
        createNftItem(newTokenId, price);
    }

    function buyNft(uint tokenId) public payable {
        NftItem storage nftItem = _idToNftItem[tokenId];
        uint price = nftItem.price;
        address owner = ERC721.ownerOf(tokenId);

        require(_listedItems != 0, "There are no NFTs for sale");
        require(_msgSender() != owner, "You already own this NFT");
        require(msg.value == price, "Please, submit the asking price");

        nftItem.isListed = false;
        _listedItems = _listedItems - 1;

        _safeTransfer(owner, _msgSender(), tokenId);
        payable(owner).transfer(msg.value);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address previousOwner) {
        previousOwner = super._update(to, tokenId, auth);

        if (previousOwner == address(0)) {
            _addTokenToAllTokensEnumeration(tokenId);
        } else if (previousOwner != to) {
            _removeTokenFromOwnerEnumeration(previousOwner, tokenId);
        }

        if (to == address(0)) {
            _removeTokenFromAllTokensEnumeration(tokenId);
        } else if (to != previousOwner) {
            _addTokenToOwnerEnumeration(to, tokenId);
        }
    }

    function _addTokenToAllTokensEnumeration(uint tokenId) private {
        uint length = _allNfts.length;
        _idToNftIndex[tokenId] = length;
        _allNfts.push(tokenId);
    }

    function _addTokenToOwnerEnumeration(address to, uint tokenId) private {
        uint length = ERC721.balanceOf(to);
        if (length >= 1) {
            length -= 1;
        }
        if (_ownedTokens[to][length] != tokenId) {
            _ownedTokens[to][length] = tokenId;
        }

        if (_idToOwnedIndex[tokenId] != length) {
            _idToOwnedIndex[tokenId] = length;
        }
    }

    function _removeTokenFromOwnerEnumeration(
        address from,
        uint tokenId
    ) private {
        uint lastTokenIndex = ERC721.balanceOf(from);
        uint tokenIndex = _idToNftIndex[tokenId];
        if (tokenIndex != lastTokenIndex) {
            uint lastTokenId = _ownedTokens[from][lastTokenIndex];
            _ownedTokens[from][tokenIndex] = lastTokenId;
            _idToOwnedIndex[lastTokenId] = tokenIndex;
        }
        delete _idToOwnedIndex[tokenId];
        delete _ownedTokens[from][lastTokenIndex];
    }

    function _removeTokenFromAllTokensEnumeration(uint tokenId) private {
        uint lastTokenIndex = _allNfts.length - 1;
        uint tokenIndex = _idToNftIndex[tokenId];
        uint lastTokenId = _allNfts[lastTokenIndex];

        _allNfts[tokenIndex] = lastTokenId;
        _idToNftIndex[lastTokenId] = tokenIndex;

        delete _idToNftIndex[tokenId];
        _allNfts.pop();
    }
}

// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

// contract NftMarket is ERC721URIStorage, Ownable {
//     uint256 private _listedItems;
//     uint256 private _tokenIds;
//     uint256[] private _allNfts;

//     uint public listingPrice = 0.025 ether;

//     mapping(string => bool) private _usedTokenURIs;
//     mapping(uint => NftItem) private _idToNftItem;
//     mapping(uint => uint) private _idToNftIndex;
//     mapping(address => mapping(uint => uint)) private _ownedTokens;
//     mapping(uint => uint) private _idToOwnedIndex;

//     struct NftItem {
//         uint tokenId;
//         uint price;
//         address creator;
//         bool isListed;
//     }

//     event NftItemCreated(
//         uint tokenId,
//         uint price,
//         address creator,
//         bool isListed
//     );

//     constructor() ERC721("CreaturesNFT", "CNFT") Ownable(_msgSender()) {}

//     function setListingPrice(uint newPrice) external onlyOwner {
//         require(newPrice > 0, "price must be at least 1 wei");
//         listingPrice = newPrice;
//     }

//     function tokenURIExist(string memory tokenURI) public view returns (bool) {
//         return _usedTokenURIs[tokenURI] == true;
//     }

//     function totalSupply() public view returns (uint) {
//         return _allNfts.length;
//     }

//     function tokenByIndex(uint index) public view returns (uint) {
//         require(index < totalSupply(), "Index out of bounds");
//         return _allNfts[index];
//     }

//     function tokenOfOwnerByIndex(
//         address owner,
//         uint index
//     ) public view returns (uint) {
//         require(index < ERC721.balanceOf(owner), "Index out of bounds");
//         return _ownedTokens[owner][index];
//     }

//     function getAllNftsOnSale() public view returns (NftItem[] memory) {
//         uint allItemsCounts = totalSupply();
//         uint currectIndex = 0;
//         NftItem[] memory items = new NftItem[](_listedItems);

//         for (uint256 index = 0; index < allItemsCounts; index++) {
//             uint tokenId = tokenByIndex(index);
//             NftItem storage item = _idToNftItem[tokenId];

//             if (item.isListed == true) {
//                 items[currectIndex] = item;
//                 currectIndex += 1;
//             }
//         }
//         return items;
//     }

//     function getOwnedNfts() public view returns (NftItem[] memory) {
//         uint ownedItemsCount = ERC721.balanceOf(_msgSender());
//         NftItem[] memory items = new NftItem[](ownedItemsCount);

//         for (uint i = 0; i < ownedItemsCount; i++) {
//             uint tokenId = tokenOfOwnerByIndex(_msgSender(), i);
//             NftItem storage item = _idToNftItem[tokenId];
//             items[i] = item;
//         }

//         return items;
//     }

//     function createNftItem(uint tokenId, uint price) private {
//         require(price > 0, "price most be at least 1 wei");
//         _idToNftItem[tokenId] = NftItem(tokenId, price, msg.sender, true);

//         emit NftItemCreated(tokenId, price, msg.sender, true);
//     }

//     function placeNftOnSale(uint tokenId, uint newPrice) public payable {
//         require(
//             _ownerOf(tokenId) == _msgSender(),
//             "you are not owner of this nft"
//         );
//         require(
//             _idToNftItem[tokenId].isListed == false,
//             "Item is aleady on sale"
//         );

//         require(
//             msg.value == listingPrice,
//             "price must be equal to listing price"
//         );

//         _idToNftItem[tokenId].isListed = true;
//         _idToNftItem[tokenId].price = newPrice;
//         _listedItems += 1;
//     }

//     function getNftItem(uint tokenId) public view returns (NftItem memory) {
//         return _idToNftItem[tokenId];
//     }

//     function listedItemsCount() public view returns (uint) {
//         return _listedItems;
//     }

//     function mintToken(
//         string memory tokenURI,
//         uint price
//     ) public payable returns (uint) {
//         require(!tokenURIExist(tokenURI), "Token URI already exists");
//         require(msg.value == listingPrice, "Price must be equal listing price");

//         _tokenIds += 1;
//         _listedItems += 1;

//         uint newTokenId = _tokenIds;

//         _safeMint(_msgSender(), newTokenId);
//         _setTokenURI(newTokenId, tokenURI);
//         _usedTokenURIs[tokenURI] = true;
//         createNftItem(newTokenId, price);

//         return newTokenId;
//     }

//     function buyNft(uint tokenId) public payable {
//         uint price = _idToNftItem[tokenId].price;
//         address owner = ERC721.ownerOf(tokenId);

//         require(_listedItems > 0, "There are no NFTs for sale");
//         require(_msgSender() != owner, "You already own this NFT");
//         require(msg.value == price, "Please, submit the asking price");

//         _idToNftItem[tokenId].isListed = false;
//         _listedItems -= 1;

//         _safeTransfer(owner, _msgSender(), tokenId);
//         payable(owner).transfer(msg.value);
//     }

//     function _update(
//         address to,
//         uint256 tokenId,
//         address auth
//     ) internal virtual override returns (address) {
//         address previousOwner = super._update(to, tokenId, auth);

//         if (previousOwner == address(0)) {
//             _addTokenToAllTokensEnumeration(tokenId);
//         } else if (previousOwner != to) {
//             _removeTokenFromOwnerEnumeration(previousOwner, tokenId);
//         }

//         if (to == address(0)) {
//             _removeTokenFromAllTokensEnumeration(tokenId);
//         } else if (to != previousOwner) {
//             _addTokenToOwnerEnumeration(to, tokenId);
//         }

//         return previousOwner;
//     }

//     function _addTokenToAllTokensEnumeration(uint tokenId) private {
//         _idToNftIndex[tokenId] = _allNfts.length;
//         _allNfts.push(tokenId);
//     }

//     function _addTokenToOwnerEnumeration(address to, uint tokenId) private {
//         uint length = ERC721.balanceOf(to);
//         if (length > 0) {
//             length -= 1;
//         }
//         _ownedTokens[to][length] = tokenId;
//         _idToOwnedIndex[tokenId] = length;
//     }

//     function _removeTokenFromOwnerEnumeration(
//         address from,
//         uint tokenId
//     ) private {
//         uint lastTokenIndex = ERC721.balanceOf(from);
//         uint tokenIndex = _idToNftIndex[tokenId];
//         if (tokenIndex != lastTokenIndex) {
//             uint lastTokenId = _ownedTokens[from][lastTokenIndex];
//             _ownedTokens[from][tokenIndex] = lastTokenId;
//             _idToOwnedIndex[lastTokenId] = tokenIndex;
//         }
//         delete _idToOwnedIndex[tokenId];
//         delete _ownedTokens[from][lastTokenIndex];
//     }

//     function _removeTokenFromAllTokensEnumeration(uint tokenId) private {
//         uint lastTokenIndex = _allNfts.length - 1;
//         uint tokenIndex = _idToNftIndex[tokenId];
//         uint lastTokenId = _allNfts[lastTokenIndex];

//         _allNfts[tokenIndex] = lastTokenId;
//         _idToNftIndex[lastTokenId] = tokenIndex;

//         delete _idToNftIndex[tokenId];
//         _allNfts.pop();
//     }
// }
