// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PlatziToken is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        // El valor en decimales de 1 token, tenemos que multiplicarlos
        _mint(msg.sender, 100000 * (10**decimals()));
    }

    // Modificacmos la funcion decimals con 6 decimales
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
