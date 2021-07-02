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

> ***hint*** likewise, this level didn’t implement some key functions — leaving Naughtcoin vulnerable to attack.

## Security Considerations
- **When interfacing with contracts or implementing an ERC interface, implement all available functions.**
- If you plan to create your own tokens, consider newer protocols like: ERC223, ERC721 (used by Cryptokitties), ERC827 (ERC 20 killer).
- If you can, check for [EIP 165 compliance](https://github.com/ethereum/EIPs/pull/881), which confirms which interface an external contract is implementing. Conversely, if you are the one issuing tokens, remember to be EIP-165 compliant.
- Remember to use SafeMath to prevent token under/overflows (as we learned in [token-attack](https://github.com/maAPPsDEV/token-attack))

## Source Code

⚠️This contract contains a bug or risk. Do not use on mainnet!

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract Token {
  mapping(address => uint256) balances;
  uint256 public totalSupply;

  constructor(uint256 _initialSupply) public {
    balances[msg.sender] = totalSupply = _initialSupply;
  }

  function transfer(address _to, uint256 _value) public returns (bool) {
    require(balances[msg.sender] - _value >= 0);
    balances[msg.sender] -= _value;
    balances[_to] += _value;
    return true;
  }

  function balanceOf(address _owner) public view returns (uint256 balance) {
    return balances[_owner];
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

You should take ownership of the target contract successfully.

```
truffle(develop)> test
Using network 'develop'.


Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



  Contract: Hacker
    √ should steal countless of tokens (377ms)


  1 passing (440ms)

```
