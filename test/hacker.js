const Hacker = artifacts.require("Hacker");
const NaughtCoin = artifacts.require("NaughtCoin");
const { expect } = require("chai");
const { BN } = require("@openzeppelin/test-helpers");
const { MAX_UINT256 } = require("@openzeppelin/test-helpers/src/constants");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Hacker", function ([_owner, _hacker, _charlie]) {
  it("should transfer", async function () {
    const targetContract = await NaughtCoin.deployed();
    await targetContract.approve(_charlie, MAX_UINT256, { from: _hacker });
    const amount = await targetContract.balanceOf(_hacker);
    await targetContract.transferFrom(_hacker, _charlie, amount, { from: _charlie });
    expect((await targetContract.balanceOf(_hacker)).isZero()).to.be.equal(true);
  });
});
