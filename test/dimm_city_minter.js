const DimmCityMinter = artifacts.require("DimmCityMinter");
const ListManager = artifacts.require("ListManager");
const SporoRabbit = artifacts.require("SporoRabbit");

const adminRole = web3.utils.padRight("0x0", 32);

//ToDo: add security checks
contract("DimmCityMinter", function (accounts) {
  it("should set a list manager", async () => {
    const minter = await DimmCityMinter.deployed();
    const manager = await ListManager.deployed();
    await minter.setListAddress(manager.address);
    return assert.isTrue(true);
  });

  it("should return correct baseUri", async () => {
    assert.isTrue(false);
  });

  it("should return pass tokenUri", async () => {
    assert.isTrue(false);
  });

  it("should pause", async () => {
    assert.isTrue(false);
  });
  it("should unpause", async () => {
    assert.isTrue(false);
  });
  it("should pause token", async () => {
    assert.isTrue(false);
  });
  it("should unpause token", async () => {
    assert.isTrue(false);
  });

  it("should not mint if paused", async () => {
    assert.isTrue(false);
  });

  it("should not mint if token is paused", async () => {
    assert.isTrue(false);
  });

  it("should not mint a pass if cost is not paid", async () => {
    assert.isTrue(false);
  });

  it("should not mint a pass if supply is too low", async () => {
    assert.isTrue(false);
  });

  it("should not mint a pass, if sender does not have credits", async () => {
    const minter = await DimmCityMinter.deployed();
    const manager = await ListManager.deployed();
    const rabbit = await SporoRabbit.deployed();

    await minter.setListAddress(manager.address);
    await manager.grantRole(adminRole, minter.address);
    await manager.configureToken.sendTransaction(rabbit.address, 10, 1000, 0);

    try {
      await minter.createMintPass.sendTransaction(rabbit.address, 1, {
        value: web3.utils.toWei("0.05", "ether"),
        from: accounts[1],
      });
      assert.isTrue(false);
    } catch (error) {
      //console.log(error.reason);
      assert.isTrue(error != null);
    }
  });

  it("should mint a pass, if sender has credits and pays fee", async function () {
    const minter = await DimmCityMinter.deployed();
    const manager = await ListManager.deployed();
    const rabbit = await SporoRabbit.deployed();

    await minter.setListAddress(manager.address);
    await manager.grantRole(adminRole, minter.address);
    await manager.configureToken.sendTransaction(
      rabbit.address,
      10,
      1000,
      web3.utils.toWei("0.04", "ether")
    );
    await manager.addUserCredits.sendTransaction(
      rabbit.address,
      accounts[1],
      1
    );

    await minter.createMintPass.sendTransaction(rabbit.address, 1, {
      value: web3.utils.toWei("0.04", "ether"),
      from: accounts[1],
    });

    console.log(minter.address, accounts[1]);
    const balance = await minter.balanceOf(accounts[1]);
    assert.equal(balance, 1);
  });

  it("should mint multiple passes, if sender has credits and pays fee", async () => {
    assert.isTrue(false);
  });

  it("should decrement pass supply and credits after minting", async () => {
    assert.isTrue(false);
  });
  it("should update pass mapping after minting", async () => {
    assert.isTrue(false);
  });

  it("should not claim token if sender has no passes", async () => {
    assert.isTrue(false);
  });

  it("should not claim token if sender has no passes for provided token", async () => {
    assert.isTrue(false);
  });

  it("should not claim token if sender has no passes", async () => {
    assert.isTrue(false);
  });

  it("should not claim token if token is paused", async () => {
    assert.isTrue(false);
  });

  it("should not claim more tokens than the wallet has passes", async () => {
    assert.isTrue(false);
  });

  it("should not claim more tokens than requested", async () => {
    assert.isTrue(false);
  });

  it("should not claim the tokens requested", async () => {
    assert.isTrue(false);
  });

  it("SHOWS ME THE MONEY!!!", async () => {
    assert.isTrue(false);
  });
  
});
