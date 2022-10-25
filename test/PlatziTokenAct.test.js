const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

const initialSupply = 1000000;
const tokenName = "PlatziTokenAct";
const tokenSymbol = "PTZA";

describe("Test | PlatziToken Actualizable", function () {
	let platziTokenAct;
	let deployer;
	let userAccount;

	describe("Token actualizable - test", function () {
		before(async function () {
			const usuarios = await ethers.getSigners();
			deployer = usuarios[0];

			const PlatziToken = await ethers.getContractFactory("PlatziTokenAct");

			// this.platziTokenAct = await PlatziToken.deploy(initialSupply);
			platziTokenAct = await upgrades.deployProxy(PlatziToken, [initialSupply], { kind: "uups" });
			await platziTokenAct.deployed();
		});

		it("Nombre del token PlatziToken", async function () {
			const TokenName = await platziTokenAct.name();
			expect(TokenName).to.be.equal(tokenName);
		});

		it('Simbolo del token "PLZ"', async function () {
			const TokenSymbol = await platziTokenAct.symbol();
			expect(TokenSymbol).to.be.equal(tokenSymbol);
		});

		it("Debería haber pasado totalSupply durante la implementación", async function () {
			const [TotalSupply, decimals] = await Promise.all([platziTokenAct.totalSupply(), platziTokenAct.decimals()]);
			const expectedTotalSupply = ethers.BigNumber.from(initialSupply).mul(ethers.BigNumber.from(10).pow(decimals));
			expect(TotalSupply.eq(expectedTotalSupply)).to.be.true;
		});
	});

	// PARA IMPLEMENTAR EL SEGUNDO CONTRATO ACTUALIZABLE
	// describe("V2 tests", function () {
	// 	before(async function () {
	// 		userAccount = (await ethers.getSigners())[1];

	// 		const PlatziTokenV2 = await ethers.getContractFactory("PlatziTokenV2");

	// 		platziTokenV2 = await upgrades.upgradeProxy(platziTokenAct.address, PlatziTokenV2);

	// 		await platziTokenV2.deployed();
	// 	});

	// 	it("Should has the same address, and keep the state as the previous version", async function () {
	// 		const [totalSupplyForNewCongtractVersion, totalSupplyForPreviousVersion] = await Promise.all([platziTokenV2.totalSupply(), platziTokenAct.totalSupply()]);
	// 		expect(platziTokenAct.address).to.be.equal(platziTokenV2.address);
	// 		expect(totalSupplyForNewCongtractVersion.eq(totalSupplyForPreviousVersion)).to.be.equal(true);
	// 	});

	// 	it("Should revert when an account other than the owner is trying to mint tokens", async function () {
	// 		const tmpContractRef = await platziTokenV2.connect(userAccount);
	// 		try {
	// 			await tmpContractRef.mint(userAccount.address, ethers.BigNumber.from(10).pow(ethers.BigNumber.from(18)));
	// 		} catch (ex) {
	// 			expect(ex.message).to.contain("reverted");
	// 			expect(ex.message).to.contain("Ownable: caller is not the owner");
	// 		}
	// 	});

	// 	it("Should mint tokens when the owner is executing the mint function", async function () {
	// 		const amountToMint = ethers.BigNumber.from(10).pow(ethers.BigNumber.from(18)).mul(ethers.BigNumber.from(10));
	// 		const accountAmountBeforeMint = await platziTokenV2.balanceOf(deployer.address);
	// 		const totalSupplyBeforeMint = await platziTokenV2.totalSupply();
	// 		await platziTokenV2.mint(deployer.address, amountToMint);

	// 		const newAccountAmount = await platziTokenV2.balanceOf(deployer.address);
	// 		const newTotalSupply = await platziTokenV2.totalSupply();

	// 		expect(newAccountAmount.eq(accountAmountBeforeMint.add(amountToMint))).to.be.true;
	// 		expect(newTotalSupply.eq(totalSupplyBeforeMint.add(amountToMint))).to.be.true;
	// 	});
	// });
});
