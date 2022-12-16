const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("Attack", function () {
  it("Should empty the balance of the good contract", async () => {
    // Deploy the good contract
    const goodContractFactory = await ethers.getContractFactory("GoodContract");
    const goodContract = await goodContractFactory.deploy();
    await goodContract.deployed();

    // Deploy the bad contract
    const badContractFactory = await ethers.getContractFactory("BadContract");
    const badContract = await badContractFactory.deploy(goodContract.address);
    await badContract.deployed();

    // Get two addresses, treat one as innocent user and one as attacker
    const [_, innocentAddress, attackerAddress] = await ethers.getSigners();

    // Innocent user deposits 10ETH into the GoodContract
    let tx = await goodContract
      .connect(innocentAddress)
      .addBalance({ value: parseEther("10") });
    await tx.wait(1);

    // Attacker calls the `attack` function on BadContract
    // and sends 1 ETH
    tx = await badContract
      .connect(attackerAddress)
      .attack({ value: parseEther("1") });
    await tx.wait(1);

    // Balance of the GoodContract's address is now zero
    balanceETH = await ethers.provider.getBalance(goodContract.address);
    expect(balanceETH).to.equal(BigNumber.from("0"));

    // Balance of BadContract is now 11ETH(10 ETH stolen + 1 ETH from the attacker)
    balanceETH = await ethers.provider.getBalance(badContract.address);
    expect(balanceETH).to.equal(parseEther("11"));
  });
});
