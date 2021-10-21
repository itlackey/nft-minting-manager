const SporoRabbit = artifacts.require("SporoRabbit");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Sporo Rabbit", function (accounts) {
  it("release contract intialization", async function () {
    const sut = await SporoRabbit.deployed();
    let result = await sut.getMetaDataUri.call();

    assert.equal(
      "https://meta.dimm.city/sporos/rabbits",
      result,
      "Invalid metadata URI"
    );

    result = await sut.getMaxSupply.call();
    assert.equal(3000, result, "Default max supply not set");

    return assert.isTrue(true);
  });

  it("should update metadata", async function () {
    const sut = await SporoRabbit.deployed();
    await sut.setMetaDataUri.sendTransaction(
      "https://meta.dimm.city/sporos/rabbits/v1"
    );
    let result = await sut.getMetaDataUri.call();

    assert.equal(
      "https://meta.dimm.city/sporos/rabbits/v1",
      result,
      "baseURI failed to update"
    );

    return assert.isTrue(true);
  });

  it("should update total supply", async function () {
    const sut = await SporoRabbit.deployed();
    await sut.setMaxSupply.sendTransaction(9000);
    let result = await sut.getMaxSupply.call();

    assert.equal(9000, result, "Max supply failed to update");

    return assert.isTrue(true);
  });
  // it("should get user whitelist entries", async function () {
  //   const sut = await SporoRabbit.deployed();
  //   return assert.isTrue(false, "Not implemented");
  // });
  it("should update user presale entries", async function () {
    const sut = await SporoRabbit.deployed();
    const walletAddress = accounts[1];

    await sut.addUserCredits.sendTransaction(walletAddress, 5);

    await sut.addUserCredits.sendTransaction(walletAddress, 5);

    let result = await sut.getUserCredits(walletAddress);
    assert.equal(result.valueOf(), 10, "Did not add credits to wallet");

    await sut.addUserCredits.sendTransaction(walletAddress, 3);
    result = await sut.getUserCredits(walletAddress);
    assert.equal(result.valueOf(), 13, "Did not add credits to wallet");

    //ToDo: allow subtraction
    return assert.isTrue(false, "Need to be able to subtract");
  });
  it("should pause minting tokens", async function () {
    const sut = await SporoRabbit.deployed();
    await sut.pause.sendTransaction();
    let isPaused = await sut.paused.call();
    assert.isTrue(isPaused, "Did not pause");

    await sut.unpause.sendTransaction();
    isPaused = await sut.paused.call();
    assert.isFalse(isPaused, "Did not unpause");

    return assert.isTrue(true);
  });
  it("should pause minting mint passes", async function () {
    // const sut = await SporoRabbit.deployed();
    // await sut.pauseMintPasses.sendTransaction();
    // let isPaused = await sut.paused.call();
    // assert.isTrue(isPaused, 'Did not pause');

    // await sut.unpauseMintPasses.sendTransaction();
    // isPaused = await sut.paused.call();
    // assert.isFalse(isPaused, 'Did not unpause');

    return assert.isTrue(false, "Not implemented");
  });

  it("should create a mint pass", async function () {
    const sut = await SporoRabbit.deployed();
    return assert.isTrue(false, "Not implemented");
  });
  it("should create a token", async function () {
    const sut = await SporoRabbit.deployed();
    return assert.isTrue(false, "Not implemented");
  });
  it("should transfer a token", async function () {
    const sut = await SporoRabbit.deployed();
    return assert.isTrue(false, "Not implemented");
  });
  it("should transfer multiple tokens without royalities", async function () {
    const sut = await SporoRabbit.deployed();
    return assert.isTrue(false, "Not implemented");
  });
  it("should burn a token", async function () {
    const sut = await SporoRabbit.deployed();
    return assert.isTrue(false, "Not implemented");
  });
  it("should allow owner to set withdraw address", async function () {
    const sut = await SporoRabbit.deployed();
    return assert.isTrue(false, "Not implemented");
  });
  it("should withdraw funds from contract", async function () {
    const sut = await SporoRabbit.deployed();
    return assert.isTrue(false, "Not implemented");
  });
});
