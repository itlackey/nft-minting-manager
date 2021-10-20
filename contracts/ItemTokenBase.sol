// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ItemTokenBase is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Pausable,
    AccessControl,
    ERC721Burnable
{
    using Counters for Counters.Counter;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 _maxSupply = 3000;
    string internal _metaDataUri;
    mapping(address => uint8) _whitelist;
    Counters.Counter private _tokenIdCounter;

    constructor(
        string memory name,
        string memory symbol,
        string memory baseUri
    ) ERC721(name, symbol) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _metaDataUri = baseUri;
    }

    function getMaxSupply()
        public
        view
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (uint256 supply)
    {
        return _maxSupply;
    }

    function setMaxSupply(uint256 supply) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _maxSupply = supply;
    }

    function getMetaDataUri() public view returns (string memory uri) {
        return _metaDataUri;
    }

    function setMetaDataUri(string memory baseURI)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
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
        return _whitelist[wallet];
    }

    function addUserCredits(address wallet, uint8 credits)
        public
        returns (uint8)
    {       
        _whitelist[wallet] = _whitelist[wallet] + credits;

        return _whitelist[wallet];
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function safeMint(address to) public onlyRole(MINTER_ROLE) {
        require(paused() == false);
        require(totalSupply() >= _maxSupply, "Out of tokens");

        _safeMint(to, _tokenIdCounter.current());
        _tokenIdCounter.increment();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
