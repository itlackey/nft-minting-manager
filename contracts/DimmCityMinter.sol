// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "./ListManager.sol";
import "./ItemTokenBase.sol";

//ToDo: consider using mappings for tokenAddress, number of passes
// adding an address param to create/claim would allow
// this contract to manage multiple create tokens mint passes
contract DimmCityMinter is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Pausable,
    AccessControl,
    ERC721Burnable
{
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    mapping(address => bool) _pausedMapping;
    mapping(uint256 => address) _passMapping;

    address private _listHolderAddress;

    constructor() ERC721("DimmCityMinter", "DIMM-PASS") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://meta.dimm.city/";
    }

    function setListAddress(address managerAddress)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _listHolderAddress = managerAddress;
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function pauseToken(address tokenAddress) public onlyRole(PAUSER_ROLE) {
        _pausedMapping[tokenAddress] = true;
    }

    function unpauseToken(address tokenAddress) public onlyRole(PAUSER_ROLE) {
        _pausedMapping[tokenAddress] = false;
    }

    function createMintPass(address tokenAddress, uint8 numberOfTokens)
        external
        payable
    {
        require(
            paused() == false && _pausedMapping[tokenAddress] == false,
            "Paused"
        );

        ListManager holder = ListManager(_listHolderAddress);
        (uint256 supply, uint256 credits, uint256 cost) = holder.getPassConfig(
            tokenAddress,
            msg.sender
        );

        require(msg.value >= (cost * numberOfTokens), "Send more money");
        require(numberOfTokens <= supply, "All our passes are belong to them");
        require(numberOfTokens <= credits, "Not enough credits");

        uint256 currentId = totalSupply();
        for (uint8 index = 0; index < numberOfTokens; index++) {
            currentId++;
            _safeMint(msg.sender, currentId);
            _passMapping[currentId] = tokenAddress;
        }
        delete currentId;

        holder.updatePassSupply(tokenAddress, msg.sender, numberOfTokens);

        //delete(holder);
        //delete supply;
    }

    function claimTokens(address tokenAddress, uint8 numberOfTokens)
        external
        payable
        returns (uint8)
    {
        uint256 balance = this.balanceOf(msg.sender);
        require(balance > numberOfTokens, "Not enough passes");
        ItemTokenBase token = ItemTokenBase(tokenAddress);

        uint8 counter;
        for (uint256 index = 0; index <= balance; index++) {
            uint256 tokenId = tokenOfOwnerByIndex(msg.sender, index);
            if (_passMapping[tokenId] == tokenAddress) {                
                _burn(tokenId);
                token.safeMint(msg.sender);
                delete _passMapping[tokenId];
                counter++;
                if (counter == numberOfTokens) break;
            }
        }

        // if (counter < numberOfTokens) {
        //     //ToDo: log this or something?
        // }

        return counter;
    }

    // function claimTokens(address tokenAddress, uint8 numberOfTokens)
    //     public
    //     returns (string memory message)
    // {
    //     //ToDo: update this to verify the pass is for the correct token
    //     require(
    //         this.balanceOf(msg.sender) >= numberOfTokens,
    //         "Not enough mint passes"
    //     );

    //     for (uint8 index = 0; index < numberOfTokens; index++) {
    //         uint256 tokenId = tokenOfOwnerByIndex(msg.sender, 0);
    //         _burn(tokenId);
    //         ItemTokenBase token = ItemTokenBase(tokenAddress);
    //         token.safeMint(msg.sender); //Note may need to pass either toAddress or address(this) to do "admin" validation
    //     }

    //     return "Burned and minted";
    // }

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
