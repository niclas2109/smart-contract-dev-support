# Commitment Pattern
## Context
The Commitment Pattern is applicable whenever entities (e.g., persons or other contracts) must commit to a value but must not know what values other entities have committed to until the values of all entities are to be revealed. This may be the case for voting schemes, lotteries or when using zero-knowledge proofs.

``Applies to: [X] EOSIO    [X] Ethereum    [X] Hyperledger Fabric``

## Problem
The objective of the Commitment Pattern is to ensure that the values which have been committed may not be visible to other entities and kept secret until the individual accounts reveal their values. Moreover, the commitments should remain binding once committed and changes of the values after the commitment must be at least recognizable or prevented. This is a problem as all smart contract interactions on the distributed ledger are usually visible to all entities.

## Forces
The forces involved in the Commitment Pattern are transaction-ordering dependence, semantic soundness and resource efficiency. The application of the Commitment Pattern allows to treat all commitments of values the same independent of the order in which the transactions have been submitted. Semantic soundness is improved as the intended execution of the smart contract (to not reveal committed values but still ensure they are binding) can be realized using the Commitment Pattern. This comes at the cost of resource efficiency as additional smart contract code needs to be implemented to realize the Commitment Pattern.

## Solution
Implement a smart contract that includes a mechanism for the commit phase and a mechanism for the reveal phase. During the commit phase, users send values they want to commit to the Commitment Contract in disguised form (e.g., hashes of these values) so that no other user knows the original values. The Commitment Contract stores all disguised values in a tamper-resistant way. To disguise the original values, the range of possible original values and their disguised representation must be considered. Otherwise, the original values may be easy to guess. For example, the corresponding pre-image of a hash value may be easy to guess by other users in scenarios with only few original values (e.g., a value v ∊ {1, 2, 3}) because hash functions are deterministic. To avoid easy guessing of the original values, a random salt must be added to each value before disguising the value.

During the subsequent reveal phase, all users send their original values and the used random salt to the Commitment Contract. The Commitment Contract compares the received values with the corresponding disguised values that the respective user has sent in the commit phase. One approach to check if the plain values correspond to the disguised values is to apply the identical procedure (e.g., keccak to hash the concatenation of the plain value and the salt) and compare the outcome of this procedure with the commitment.

## Example

```Solidity
pragma solidity 0.7.0;

contract CommitmentPattern {
    struct UserCommit { 
        bytes32 secretCommit; 
        bytes32 secretSalt; 
        string plainValue; 
        string plainSalt;
    }

    mapping(address => UserCommit) public userCommits;

    function commit(bytes32 _secretCommit, bytes32 _secretSalt) public {
        require(userCommits[msg.sender].secretCommit == "", "Your commitment cannot be changed anymore.");

        UserCommit memory uC = userCommits[msg.sender];
        uC.secretCommit = _secretCommit;
        uC.secretSalt = _secretSalt;

        userCommits[msg.sender] = uC;
    }

    function reveal(string memory _plainSalt, string memory _plainValue) public { 
        require(userCommits[msg.sender].secretCommit != "", "You did not commit to a value"); 
        require(userCommits[msg.sender].secretSalt == keccak256(abi.encode(_plainSalt)), "Your salt does not match the original one."); 
        require(userCommits[msg.sender].secretCommit == keccak256(abi.encodePacked(_plainSalt, _plainValue)), "Invalid values.");

        userCommits[msg.sender].plainSalt = _plainSalt;
        userCommits[msg.sender].plainValue = _plainValue;
    }
}
```

Note: We did not implement events for the sake of simplicity of the example. For a better integration into software applications, events should be implemented at the end of the commit(…) and/or reveal(…) function.

## Resulting Context
The smart contract stores the disguised values in a tamper-resistant way and all commits are binding. The disguised values can be revealed by users afterwards. Developers should consider the case that not all users will reveal their secret values.

## Rationale
All transactions and their contents stored on the distributed ledger are publicly transparent. Therefore, the secret values to which the users have committed themselves are already stored on the distributed ledger in a tamper-resistant manner. The challenge is to keep the data secret from potentially malicious users who might try to uncover the secret value. Therefore, we recommend adding a salt to the secret value and allowing only the issuer of the secret value to reveal it.

## Related Patterns
\-

## Known Uses
[Registrar](https://etherscan.io/address/0x6090A6e47849629b7245Dfa1Ca21D94cd15878Ef#code) (lines 344ff)
