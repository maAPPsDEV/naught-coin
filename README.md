# Solidity Game - Naught Coin Attack

_Inspired by OpenZeppelin's [Ethernaut](https://ethernaut.openzeppelin.com), Naught Coin Level_

⚠️Do not try on mainnet!

## Task

NaughtCoin is an ERC20 token and you're already holding all of them. The catch is that you'll only be able to transfer them after a 10 year lockout period. Can you figure out how to get them out to another address so that you can transfer them freely? Complete this game by getting your token balance to 0.

_Hint:_

1. The [ERC20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md) Spec
2. The [OpenZeppelin](https://github.com/OpenZeppelin/zeppelin-solidity/tree/master/contracts) codebase

## What will you learn?

1. ERC20
2. Function overriding

## What is the most difficult challenge?

### What is ERC20

ERCs (Ethereum Request for Comment) are protocols that allow you to create tokens on the blockchain. ERC20, specifically, is a [contract interface](https://github.com/maAPPsDEV/elevator-attack) that defines standard ownership and transaction rules around tokens.

Contextually, ERC20 was cool in 2015 because it was like an API that all developers agreed on. For the first time, anyone could create a new asset class. Developers came up with tokens like Dogecoin, Kucoin, Dentacoin… and could trust that their tokens were accepted by wallets, exchanges, and contracts everywhere.

![naught1](https://user-images.githubusercontent.com/78368735/124309950-81aab800-db39-11eb-965e-3de09b5c7875.png)

**Security issues that accompanied ERC20**

- **Batchoverflow**: because ERC20 did not enforce SafeMath, it was possible to underflow integers. As we learned in [token-attack](https://github.com/maAPPsDEV/token-attack), this meant that depleting your tokens under 0 would give you `2^256 - 1` tokens!
- **Transfer “bug”**: makers of ERC20 intended for developers to use `approve()` & `transferfrom()` function combination to move tokens around. But this was never clearly stated in documentation, nor did they warn against using `transfer()` (which was also available). Many developers used `transfer()` instead, which locked many tokens forever.
  > As we learned in [king-attack](https://github.com/maAPPsDEV/king-attack), you can’t guarantee 3rd contracts will receive your transfer. If you transfer tokens into non-receiving parties, you will lose tokens forever, since the token contract already decremented your own account’s balance.
- **Poor ERC20 inheritance**: some token contracts did not properly implement the ERC interface, which led to many issues. For example, Golem’s GNT didn’t even implement the crucial `approve()` function, leaving `transfer()` as the only, problematic option.

> **_hint_** likewise, this level didn’t implement some key functions — leaving Naughtcoin vulnerable to attack.

## Security Considerations

- **When interfacing with contracts or implementing an ERC interface, implement all available functions.**
- If you plan to create your own tokens, consider newer protocols like: ERC223, ERC721 (used by Cryptokitties), ERC827 (ERC 20 killer).
- If you can, check for [EIP 165 compliance](https://github.com/ethereum/EIPs/pull/881), which confirms which interface an external contract is implementing. Conversely, if you are the one issuing tokens, remember to be EIP-165 compliant.
- Remember to use SafeMath to prevent token under/overflows (as we learned in [token-attack](https://github.com/maAPPsDEV/token-attack))

## Source Code

⚠️This contract contains a bug or risk. Do not use on mainnet!

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NaughtCoin is ERC20 {
  // string public constant name = 'NaughtCoin';
  // string public constant symbol = '0x0';
  // uint public constant decimals = 18;
  uint256 public timeLock = block.timestamp + 10 * 365 days;
  uint256 public INITIAL_SUPPLY;
  address public player;

  constructor(address _player) ERC20("NaughtCoin", "0x0") {
    player = _player;
    INITIAL_SUPPLY = 1000000 * (10**uint256(decimals()));
    // _totalSupply = INITIAL_SUPPLY;
    // _balances[player] = INITIAL_SUPPLY;
    _mint(player, INITIAL_SUPPLY);
    emit Transfer(address(0), player, INITIAL_SUPPLY);
  }

  function transfer(address _to, uint256 _value) public override lockTokens returns (bool) {
    super.transfer(_to, _value);
  }

  // Prevent the initial owner from transferring tokens until the timelock has passed
  modifier lockTokens() {
    if (msg.sender == player) {
      require(block.timestamp > timeLock);
      _;
    } else {
      _;
    }
  }
}

```

## Configuration

### Install Truffle cli

_Skip if you have already installed._

```
npm install -g truffle
```

### Install Dependencies

```
yarn install
```

## Test and Attack!💥

### Run Tests

```
truffle develop
test
```

You should reset your balance as 0.

```
truffle(develop)> test
Using network 'develop'.


Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



  Contract: Hacker
    √ should transfer (655ms)


  1 passing (783ms)

```
