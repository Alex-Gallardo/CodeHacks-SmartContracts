// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

// Contrato que ayuda a codificar estructuras del EIP712
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
// Contrato con utilidades para la verificacion de firmas
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract EIP712MessageCounter is EIP712 {
    mapping(address => uint256) private _counters; // Cuantos mensajes a enviado esta cuenta.
    mapping(address => string) private _accountsLastMessage; // Guardamos el ultimo mensaje enviado.

    // Estructura de la firma
    struct Signature {
        address signer;
        string message;
    }

    // typeHash
    // bytes32 private constant _SIGNATURE_STRUCT_HASH = keccak256(abi.encodePacked(Signature));
    bytes32 private constant _SIGNATURE_STRUCT_HASH =
        keccak256("Signature(address signer, string message)");

    // Inicio del contrato EIP712 con información de separador de dominio
    constructor() EIP712("EIP712MessageCounter", "0.1.0") {}

    // Funcion que verifica la firma de un mensaje
    function _verifySignedMessage(
        Signature calldata signatureMessage,
        bytes calldata signature
    ) private view returns (bool) {
        // cadena de bytes para el mensaje de estructura
        bytes32 digest = _hashTypedDataV4(
            // domainSeparator | hashStruct (S)
            keccak256(
                abi.encode(
                    _SIGNATURE_STRUCT_HASH,
                    signatureMessage.signer,
                    keccak256(bytes(signatureMessage.message))
                )
            )
        );

        // Obtener el remitente del mensaje y comparar el resultado
        address messageSigner = ECDSA.recover(digest, signature);
        return messageSigner == signatureMessage.signer;
    }

    // Almacenamiento de la cuenta y el mensaje
    function setSignerMessage(
        Signature calldata signatureMessage,
        bytes calldata signature
    ) public returns (bool) {
        // la verificacion de la firma es correcta
        require(
            _verifySignedMessage(signatureMessage, signature),
            "EIP712MessageCounter: Signature does not match expected Signature message"
        );

        // Aumentamos el conteo de mensajes para la firma OffChain
        _counters[signatureMessage.signer] =
            _counters[signatureMessage.signer] +
            1;
        _accountsLastMessage[signatureMessage.signer] = signatureMessage
            .message;

        return true;
    }

    function countOf(address account) public view returns (uint256) {
        return _counters[account];
    }

    function lastMessageOf(address account)
        public
        view
        returns (string memory)
    {
        return _accountsLastMessage[account];
    }
}
