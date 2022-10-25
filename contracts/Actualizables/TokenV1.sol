// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

// Importamos la version Upgradeable del contrato ERC20
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol"; // Solo el dueno del contrato puede ejecutar ciertas funciones
// Importamos el contrato del proxy | tipo UUPS
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract TokenV1 is ERC20Upgradeable, UUPSUpgradeable, OwnableUpgradeable {
    // Usando una instancia inicializada de un constructor
    function initialize(uint256 initialSupply) public initializer {
        // Como no estamos usando un constructor, tenemos que usar el contrato ERC20 inicializado
        __ERC20_init("TokenAct", "TkA");
        // La cuenta que hace el despliege quede como la cuenta dueño
        __Ownable_init_unchained();
        // Inicializamos el contrato del proxy
        __UUPSUpgradeable_init();
        // Minteamos la cantidad de tokens iniciales
        _mint(msg.sender, initialSupply * (10**decimals()));
    }

    // Es necesario reescribir esta funcion, que es requirida por el tipo de proxy UUPS
    function _authorizeUpgrade(address newImplemetation)
        internal
        override
        onlyOwner
    {}
}
