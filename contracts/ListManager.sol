// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract ListManager is AccessControl {
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    struct TokenConfig {
        uint256 passSupply;
        uint256 passCost;
        uint256 tokenCost;
    }

    mapping(address => TokenConfig) private _tokens;
    mapping(address => mapping(address => uint256)) private _credits;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MANAGER_ROLE, msg.sender);
    }

    function configureToken(
        address _tokenAddress,
        uint256 _passSupply,
        uint256 _passCost,
        uint256 _cost
    ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (TokenConfig memory) {
        TokenConfig storage config = _tokens[_tokenAddress];
        config.passSupply = _passSupply;
        config.passCost = _passCost;
        config.tokenCost = _cost;

        return _tokens[_tokenAddress];
    }

    function getPassConfig(address _tokenAddress, address _walletAddress)
        external
        view
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (
            uint256 supply,
            uint256 credits,
            uint256 cost
        )
    {
        TokenConfig storage config = _tokens[_tokenAddress];

        return (
            config.passSupply,
            _credits[_tokenAddress][_walletAddress],
            config.passCost
        );
    }

    function getUserCredits(address _tokenAddress, address _walletAddress)
        external
        view
        returns (uint256)
    {
        return _credits[_tokenAddress][_walletAddress];
    }

    function addUserCredits(
        address _tokenAddress,
        address _walletAddress,
        uint256 _numberOfCredits
    ) external {
        if (_numberOfCredits > 0)
            _credits[_tokenAddress][_walletAddress] += _numberOfCredits;
        else _credits[_tokenAddress][_walletAddress] = 0;
    }

    function updatePassSupply(
        address _tokenAddress,
        address _walletAddress,
        uint256 _numberOfCredits
    ) external {
        if (_numberOfCredits > _credits[_tokenAddress][_walletAddress])
            _credits[_tokenAddress][_walletAddress] = 0;
        else _credits[_tokenAddress][_walletAddress] -= _numberOfCredits;

        if (_numberOfCredits > _tokens[_tokenAddress].passSupply)
            _tokens[_tokenAddress].passSupply = 0;
        else _tokens[_tokenAddress].passSupply -= _numberOfCredits;
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
