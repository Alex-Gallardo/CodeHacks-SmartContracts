// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract TokenV2 is ERC20Upgradeable, UUPSUpgradeable, OwnableUpgradeable {
    function initialize(uint256 initialSupply) public initializer {
        __ERC20_init("TokenAct", "TkA");
        __Ownable_init_unchained();
        __UUPSUpgradeable_init();
        _mint(msg.sender, initialSupply * (10**decimals()));
    }

    // Es necesario reescribir esta funcion, que es requirida por el tipo de proxy UUPS
    function _authorizeUpgrade(address newImplemetation)
        internal
        override
        onlyOwner
    {}

    function mint(address cuenta, uint256 monto) public onlyOwner {
        _mint(cuenta, monto);
    }
}
