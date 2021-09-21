const MintingManager = artifacts.require("MintingManager");
const ListManager = artifacts.require("ListManager");
const SporoRabbit = artifacts.require("SporoRabbit");

const adminRole = web3.utils.padRight("0x0", 32);

//ToDo: add security checks
contract("MintingManager", function (accounts) {
  it("should set a list manager", async () => {
    const minter = await MintingManager.deployed();
    const manager = await ListManager.deployed();
    await minter.setListAddress(manager.address);
    return assert.isTrue(true);
  });

  // it("should return correct baseUri", async () => {
  //   const minter = await MintingManager.deployed();
  //   assert.equal(minter.tokenURI(123), "https://meta.dimm.city/");
  // });

  it("should return pass tokenUri", async () => {
    const minter = await MintingManager.deployed();
    const url = ""; //minter.tokenURI.call(0);
    assert.equal(url, "https://meta.dimm.city/passes/123");
  });

  it("should pause", async () => {
    const minter = await MintingManager.deployed();
    await minter.pause.sendTransaction();
    const isPaused = await minter.paused.call();
    assert.isTrue(isPaused);
  });
  it("should unpause", async () => {
    const minter = await MintingManager.deployed();
    await minter.pause.sendTransaction();
    await minter.unpause.sendTransaction();
    const isPaused = await minter.paused.call();
    assert.equal(isPaused, false);
  });
  it("should pause token", async () => {
    const minter = await MintingManager.deployed();
    await minter.pauseToken.sendTransaction(minter.address);
    const isPaused = await minter.tokenPaused.call(minter.address);
    assert.equal(isPaused, true);
  });
  it("should unpause token", async () => {
    const minter = await MintingManager.deployed();
    await minter.pauseToken.sendTransaction(minter.address);
    await minter.unpauseToken.sendTransaction(minter.address);
    const isPaused = await minter.tokenPaused.call(minter.address);
    assert.equal(isPaused, true);
  });

  it("should not mint if paused", async () => {
    try {
      const supply = 0;
      const passCost = web3.utils.toWei("0.04", "ether");
      const tokenCost = 0;
      const walletAddress = accounts[1];
      const numberOfPasses = 1;

      let { minter, creature } = await setupValidMinter(
        supply,
        passCost,
        tokenCost,
        walletAddress
      );

      await minter.pause.sendTransaction();
      await minter.createMintPass.sendTransaction(
        creature.address,
        numberOfPasses,
        {
          value: passCost,
          from: walletAddress,
        }
      );
      assert.isTrue(false);
    } catch (error) {
      assert.isTrue(error != null);
      assert.equal(error.reason, "PAUSED");
    }
  });

  it("should not mint if token is paused", async () => {
    try {
      const supply = 0;
      const passCost = web3.utils.toWei("0.04", "ether");
      const tokenCost = 0;
      const walletAddress = accounts[1];
      const numberOfPasses = 1;

      let { minter, creature } = await setupValidMinter(
        supply,
        passCost,
        tokenCost,
        walletAddress
      );

      await minter.pauseToken.sendTransaction(creature.address);

      await minter.createMintPass.sendTransaction(
        creature.address,
        numberOfPasses,
        {
          value: passCost,
          from: walletAddress,
        }
      );
      assert.isTrue(false);
    } catch (error) {
      assert.isTrue(error != null);
      assert.equal(error.reason, "PAUSED");
    }
  });

  it("should not mint a pass if cost is not paid", async () => {
    try {
      const supply = 0;
      const passCost = web3.utils.toWei("0.04", "ether");
      const tokenCost = 0;
      const walletAddress = accounts[1];
      const numberOfPasses = 1;

      let { minter, creature } = await setupValidMinter(
        supply,
        passCost,
        tokenCost,
        walletAddress
      );

      await minter.pauseToken.sendTransaction(creature.address);

      await minter.createMintPass.sendTransaction(
        creature.address,
        numberOfPasses,
        {
          value: 0,
          from: walletAddress,
        }
      );
      assert.isTrue(false);
    } catch (error) {
      assert.isTrue(error != null);
      assert.equal(error.reason, "MONEY");
    }
  });

  it("should not mint a pass if supply is too low", async () => {
    try {
      const supply = 0;
      const passCost = web3.utils.toWei("0.04", "ether");
      const tokenCost = 0;
      const walletAddress = accounts[1];
      const numberOfPasses = 1;

      let { minter, creature } = await setupValidMinter(
        supply,
        passCost,
        tokenCost,
        walletAddress
      );

      await minter.createMintPass.sendTransaction(
        creature.address,
        numberOfPasses,
        {
          value: passCost,
          from: walletAddress,
        }
      );
      assert.isTrue(false);
    } catch (error) {
      assert.isTrue(error != null && error.reason != null);
      assert.equal(error.reason, "SUPPLY");
    }
  });

  it("should not mint a pass, if sender does not have credits", async () => {
    try {
      const supply = 10000;
      const passCost = 0;
      const tokenCost = 0;
      const walletAddress = accounts[1];
      const numberOfPasses = 1;
      const userCredits = 0;

      let { minter, creature } = await setupValidMinter(
        supply,
        passCost,
        tokenCost,
        walletAddress,
        userCredits
      );

      await minter.createMintPass.sendTransaction(
        creature.address,
        numberOfPasses,
        {
          value: passCost,
          from: walletAddress,
        }
      );
      assert.isTrue(false);
    } catch (error) {
      assert.isTrue(error != null);
      assert.equal(error.reason, "CREDITS");
    }
  });

  it("should mint a pass, if sender has credits and pays fee", async function () {
    try {
      const supply = 1000;
      const passCost = web3.utils.toWei("0.04", "ether");
      const tokenCost = 0;
      const walletAddress = accounts[1];
      const numberOfPasses = 1;

      let { minter, creature } = await setupValidMinter(
        supply,
        passCost,
        tokenCost,
        walletAddress
      );

      await minter.createMintPass.sendTransaction(
        creature.address,
        numberOfPasses,
        {
          value: passCost,
          from: walletAddress,
        }
      );

      const balance = await minter.balanceOf(walletAddress);
      assert.equal(balance.valueOf(), numberOfPasses);
    } catch (error) {
      console.log(error.reason);
      assert.isTrue(false);
    }
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

  it("should claim the tokens requested", async () => {
    assert.isTrue(false);
  });

  it("SHOWS ME THE MONEY!!!", async () => {
    assert.isTrue(false);
  });
});

async function setupValidMinter(
  supply,
  passCost,
  cost,
  userWalletAddress,
  userCredits = 3
) {
  const minter = await MintingManager.deployed();
  const manager = await ListManager.deployed();
  const rabbit = await SporoRabbit.deployed();
  await minter.setListAddress(manager.address);
  await manager.grantRole(adminRole, minter.address);
  await manager.configureToken.sendTransaction(
    rabbit.address,
    supply,
    passCost,
    cost
  );

  await manager.addUserCredits.sendTransaction(
    rabbit.address,
    userWalletAddress,
    userCredits
  );

  const paused = await minter.paused.call();
  if (paused) {
    await minter.unpause.sendTransaction();
  }

  const tokenPaused = await minter.tokenPaused.call(rabbit.address);
  if (tokenPaused) {
    await minter.unpauseToken.sendTransaction(rabbit.address);
  }

  return {
    minter: minter,
    manager: manager,
    creature: rabbit,
  };
}
