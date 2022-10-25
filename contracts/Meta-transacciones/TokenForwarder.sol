// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

/** Importaciones */
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol"; // Contrato con utilidades para el manejo de firma
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol"; // Contrato con la decodificación de estructuras EIP712

contract TokenForwarder is EIP712 {
    // Definimos la estructura de la metatransacción
    struct MetaTx {
        address from;
        address to;
        uint256 nonce;
        bytes data;
    }

    // typeHash
    bytes32 private constant _SIGNATURE_STRUCT_HASH =
        keccak256(
            "MetaTx(address from, address to, uint256 nonce, bytes data)"
        );

    // Almacenar nonces para evitar ataques de replay
    mapping(address => uint256) private nonces;

    constructor() EIP712("TokenForwarder", "0.1.0") {}

    // Obtener el nonce actual para una cuenta
    function getNonce(address account) public view returns (uint256) {
        return nonces[account];
    }

    // Verificacion de la meta-transaccion (firma)
    function _verifyMetaTx(MetaTx calldata metaTx, bytes calldata signature)
        private
        view
        returns (bool)
    {
        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    // hashStruct(MetaTx)
                    _SIGNATURE_STRUCT_HASH,
                    metaTx.from,
                    metaTx.to,
                    metaTx.nonce,
                    keccak256(metaTx.data)
                )
            )
        );

        // Obtenemos la cuenta que realizó la firma
        address metaTxSigner = ECDSA.recover(digest, signature);
        // Verificamos que la firma sea válida
        return metaTxSigner == metaTx.from;
    }

    // Funcion que ejecuta meta-transacciones
    function executeFunction(MetaTx calldata metaTx, bytes calldata signature)
        public
        returns (bool)
    {
        // Verificamos la firma
        require(_verifyMetaTx(metaTx, signature), "Firma invalida");

        // incrementando nonce para que el mensaje no se pueda usar de nuevo
        nonces[metaTx.from] = metaTx.nonce + 1;

        // agregar la dirección a los datos de la transacción para que el contrato de token pueda usarla
        (bool success, ) = metaTx.to.call(
            abi.encodePacked(metaTx.data, metaTx.from)
        );

        // retornamos si la ejecución del contrato fue exitosa
        return success;
    }
}
