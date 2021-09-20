const ListManager = artifacts.require("ListManager");
//ToDo: add security tests
//ToDo: add unhappy paths
contract("ListManager", function (accounts) {
  it("should configure a new token", async function () {
    const manager = await ListManager.deployed();

    await manager.configureToken.sendTransaction(
      manager.address,
      1000,
      web3.utils.toWei("0.04", "ether"),
      0
    );

    const config = await manager.getPassConfig.call(
      manager.address,
      accounts[0]
    );

    assert.equal(config.cost.valueOf(), web3.utils.toWei("0.04", "ether"));
    assert.equal(config.supply.valueOf(), 1000);
    assert.equal(config.credits.valueOf(), 0);
  });

  it("should add user credits", async function () {
    const manager = await ListManager.deployed();
    const walletAddress = accounts[1];// web3.utils.randomHex(42);
    
    await manager.addUserCredits.sendTransaction(
      manager.address,
      walletAddress,
      5
    );

    await manager.addUserCredits.sendTransaction(
      manager.address,
      walletAddress,
      5
    );

    const result = await manager.getUserCredits(manager.address, walletAddress);
    assert.equal(result.valueOf(), 10);
  });

  it("should update pass supply", async function () {
    const manager = await ListManager.deployed();
    const walletAddress = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
    await manager.configureToken.sendTransaction(
      manager.address,
      1000,
      web3.utils.toWei("0.04", "ether"),
      0
    );

    await manager.addUserCredits.sendTransaction(
      manager.address,
      walletAddress,
      10
    );

    await manager.updatePassSupply.sendTransaction(
      manager.address,
      walletAddress,
      7
    );

    result = await manager.getUserCredits(manager.address, walletAddress);
    assert.equal(result.toNumber(), 3);

    const config = await manager.getPassConfig(manager.address, walletAddress);
    assert.equal(config.credits.valueOf(), 3);
    assert.equal(config.supply.valueOf(), 993);
  });
});
