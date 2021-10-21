// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./ERC721Enumerable.sol";

contract CharacterBase is ERC721Enumerable {

    bool _paused;
    uint256 _maxSupply = 3000;
    string internal _metaDataUri;
    mapping(address => uint8) _presaleList;
    uint256 private _tokenIdCounter;

    constructor(
        string memory name,
        string memory symbol,
        string memory baseUri
    ) ERC721(name, symbol) {
        _metaDataUri = baseUri;
        _paused = true;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    modifier whenNotPaused() {
        require(!_paused, "Pausable: paused");
        _;
    }

    function getMaxSupply() public view onlyOwner returns (uint256 supply) {
        return _maxSupply;
    }

    function setMaxSupply(uint256 supply) public onlyOwner {
        _maxSupply = supply;
    }

    function getMetaDataUri() public view returns (string memory uri) {
        return _metaDataUri;
    }

    function setMetaDataUri(string memory baseURI) public onlyOwner {
        _metaDataUri = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _metaDataUri;
    }

    function getUserCredits(address wallet)
        public
        view
        returns (uint8 credits)
    {
        return _presaleList[wallet];
    }

    function addUserCredits(address wallet, uint8 credits)
        public
        returns (uint8)
    {
        _presaleList[wallet] = _presaleList[wallet] + credits;

        return _presaleList[wallet];
    }

    function paused() public view returns(bool) {
        return _paused;
    }

    function pause() public onlyOwner {
        _paused = true;
    }

    function unpause() public onlyOwner {
        _paused = false;
    }

    function safeMint(address to) public onlyOwner whenNotPaused {
        require(totalSupply() >= _maxSupply, "Out of tokens");

        _safeMint(to, _tokenIdCounter);
        _tokenIdCounter += 1;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    // function _burn(uint256 tokenId) internal override(ERC721) {
    //     super._burn(tokenId);
    // }

    // function tokenURI(uint256 tokenId)
    //     public
    //     view
    //     override(ERC721)
    //     returns (string memory)
    // {
    //     return super.tokenURI(tokenId);
    // }

    // function supportsInterface(bytes4 interfaceId)
    //     public
    //     pure
    //     override(ERC721Enumerable)
    //     returns (bool)
    // {
    //     return super.supportsInterface(interfaceId);
    // }
}
