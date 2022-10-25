const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

const initialSupply = 1000000;
const tokenNameInitial = "TokenAct";
const tokenSymbolInitial = "TkA";

describe("Token tests-actualizables", function () {
	let tokenV1;
	let tokenV2;
	let deployer;
	let userAccount;

	describe("TokenV1 | Test", function () {
		before(async function () {
			const availableSigners = await ethers.getSigners();
			deployer = availableSigners[0];

			const TokenContract = await ethers.getContractFactory("TokenV1");

			// this.tokenV1 = await TokenContract.deploy(initialSupply);
			tokenV1 = await upgrades.deployProxy(TokenContract, [initialSupply], { kind: "uups" });
			await tokenV1.deployed();
		});

		it("Debe ser nombrado TokenAct", async function () {
			const tokenName = await tokenV1.name();
			expect(tokenName).to.be.equal(tokenNameInitial);
		});

		it('Should have symbol "TkA"', async function () {
			const tokenSymbol = await tokenV1.symbol();
			expect(tokenSymbol).to.be.equal(tokenSymbolInitial);
		});

		it("Debería haber pasado totalSupply durante la implementación", async function () {
			const [fetchedTotalSupply, decimals] = await Promise.all([tokenV1.totalSupply(), tokenV1.decimals()]);
			const expectedTotalSupply = ethers.BigNumber.from(initialSupply).mul(ethers.BigNumber.from(10).pow(decimals));
			expect(fetchedTotalSupply.eq(expectedTotalSupply)).to.be.true;
		});

		it("Debería encontrarse con un error al ejecutar una función que no existe", async function () {
			expect(() => tokenV1.mint(deployer.address, ethers.BigNumber.from(10).pow(18))).to.throw();
		});
	});

	// TokenV2
	describe("TokenV2 | test", function () {
		before(async function () {
			userAccount = (await ethers.getSigners())[1];

			const TokenContract = await ethers.getContractFactory("TokenV2");

			tokenV2 = await upgrades.upgradeProxy(tokenV1.address, TokenContract);

			await tokenV2.deployed();
		});

		it("Debería tener la misma dirección y mantener el estado que la versión anterior", async function () {
			const [totalSupplyForNewCongtractVersion, totalSupplyForPreviousVersion] = await Promise.all([tokenV2.totalSupply(), tokenV1.totalSupply()]);
			expect(tokenV1.address).to.be.equal(tokenV2.address);
			expect(totalSupplyForNewCongtractVersion.eq(totalSupplyForPreviousVersion)).to.be.equal(true);
		});

		it("Debería revertirse cuando una cuenta que no sea el propietario está tratando de acuñar tokens", async function () {
			const tmpContractRef = await tokenV2.connect(userAccount);
			try {
				await tmpContractRef.mint(userAccount.address, ethers.BigNumber.from(10).pow(ethers.BigNumber.from(18)));
			} catch (ex) {
				expect(ex.message).to.contain("reverted");
				expect(ex.message).to.contain("Ownable: caller is not the owner");
			}
		});

		it("Debería acuñar tokens cuando el propietario está ejecutando la función de acuñación", async function () {
			const amountToMint = ethers.BigNumber.from(10).pow(ethers.BigNumber.from(18)).mul(ethers.BigNumber.from(10));
			const accountAmountBeforeMint = await tokenV2.balanceOf(deployer.address);
			const totalSupplyBeforeMint = await tokenV2.totalSupply();
			await tokenV2.mint(deployer.address, amountToMint);

			const newAccountAmount = await tokenV2.balanceOf(deployer.address);
			const newTotalSupply = await tokenV2.totalSupply();

			expect(newAccountAmount.eq(accountAmountBeforeMint.add(amountToMint))).to.be.true;
			expect(newTotalSupply.eq(totalSupplyBeforeMint.add(amountToMint))).to.be.true;
		});
	});
});
