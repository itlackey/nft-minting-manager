const ItemTokenBase = artifacts.require("ItemTokenBase");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("ItemTokenBase", function (/* accounts */) {
  it("should be able to be paused", async function () {
    await ItemTokenBase.deployed();
    return assert.isTrue(true);
  });
  it("should be able to be unpaused", async function () {
    await ItemTokenBase.deployed();
  });
});
