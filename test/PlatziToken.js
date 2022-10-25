const { expect } = require("chai");
// const { ethers } = require("ethers");

// const initialSupply = ethers.utils.parseEther('1000000');
const initialSupply = 1000000;
const tokenName = "PlatziToken";
const tokenSymbol = "PTZ";

describe("Test | PlatziToken", () => {
	let platziToken;
	// Hook Before: Para hacer el setup de despliege del contrato
	before(async () => {
		// const aviableSigners = ethers.getSigners();
		// this.deploy = aviableSigners[0];

		// Importanr el contrato que queremos desplegar
		const PlatziToken = await ethers.getContractFactory("PlatziToken");
		platziToken = await PlatziToken.deploy(tokenName, tokenSymbol);
		await platziToken.deployed();
	});

	// Casos que queremos probar

	// Caso 1: Crear un nuevo token
	// it("Crear un nuevo token", async () => {
	// 	const supply = await this.platziToken.totalSupply();
	// 	// expect(supply).to.equal(initialSupply);
	// 	expect(supply).to.be.equal(initialSupply);
	// });

	// Caso 2: Obtener el nombre del token
	it("Obtener el nombre del token", async () => {
		const name = await platziToken.name();
		// expect(name).to.equal(tokenName);
		expect(name).to.be.equal(tokenName);
	});

	// Caso 3: Obtener el simbolo del token
	it("Obtener el simbolo del token", async () => {
		const symbol = await platziToken.symbol();
		// expect(symbol).to.equal(tokenSymbol);
		expect(symbol).to.be.equal(tokenSymbol);
	});

	// La cantidad de tokens que se pueden crear, correspondan a un valor esperado
	// it("La cantidad de tokens que se pueden crear, correspondan a un valor esperado", async () => {
	// 	const [fechedTotalSupply, decimals] = await Promise.all([this.platziToken.totalSupply(), this.platziToken.decimals()]);

	// 	// const expectedTotalSupply = initialSupply * Math.pow(10, decimals);
	// 	const expectedTotalSupply = ethers.BigNumber.from(initialSupply).mul(ethers.BigNumber.from(10).pow(ethers.BigNumber.from(decimals)));
	// 	// expect(fechedTotalSupply).to.equal(expectedTotalSupply);
	// 	expect(fechedTotalSupply.eq(expectedTotalSupply).to.be.true);
	// });
});
