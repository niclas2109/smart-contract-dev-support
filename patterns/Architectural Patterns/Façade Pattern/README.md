# Façade Pattern
## Context
The Façade Pattern is applicable when working with smart contract systems. A smart contract system comprises several separate smart contracts with individual addresses that interact with one another. Smart contract systems are used to achieve separation of concerns by dividing the application logic into different smart contracts. To use the entire application logic, functions of the individual smart contracts are called manually.

``Applies to: [X] EOSIO    [X] Ethereum    [] Hyperledger Fabric``

## Problem
The aim of the Façade Pattern is to simplify and increase security of interactions with a smart contract system. Manually orchestrating interactions with multiple smart contracts is prone to errors and flaws (e.g., because of misspellings or neglected side effects across smart contracts). In Ethereum, interactions with smart contract systems become even more challenging when updated smart contracts are redeployed because their addresses change. The addresses must be updated in all smart contracts, oracles, and frontends that make calls to the deprecated contract.

## Forces
The forces involved in the Façade Pattern are maintainability, manual effort, and resource efficiency. Maintainability is improved by offering a single point of entry through the Façade Contract while simultaneously reducing manual effort through automation. The application of the Façade Pattern comes at the cost of resource efficiency through the deployment of an additional smart contract, the Façade Contract.

## Solution
There are two roles smart contracts can take in the Façade Pattern: Satellite or Façade Contract. Satellites are smart contracts that represent a module in the contract system. The Façade Contract serves as an entry point to interact with the Satellites. Each Satellite’s address is registered with the Façade Contract. With only one call to the Façade Contract, a sequence of calls to functions of the individual Satellites can be executed. To execute a certain logic expressed in a sequence of smart contract calls, the Façade Contract loads the instance(s) of the required Satellites using the registered smart contract addresses and calls targeted functions in a defined order. All interactions with Satellites and potential errors are handled by the Façade Contract.

## Example
Wrong | Correct
------------ | -------------
![Wrong](Façade%20Pattern%20-%20Direct%20Calls%20without%20Façade.png) | ![Correct](Façade%20Pattern%20-%20Direct%20via%20Façade.png)

## Resulting Context
The Façade Contract offers an entry point for the execution of an application logic composed of logic implemented in multiple Satellites and, thus, eases the execution of such composed application logic. Because of the use of different Satellites implementing logic for specific subtasks, developers can use those Satellites in several Façade Contracts. In addition, the Façade Contract allows to update individual Satellites by registering a novel address as long as the interfaces of the individual satellites comply with those of the original Satellites. However, the updates of smart contracts deteriorate transparency because entities should first check if the used Satellites in the execution of a Façade Contract function still fulfill the intended tasks. Hence, entities must trust the developers of the Satellites and the Façade Contract. Developers of the Façade Contract must implement an appropriate authorization concept to update Satellite addresses.

## Rationale
The orchestration of different smart contracts via a Façade Contract serving as a proxy eases the execution of multiple, interdependent smart con-tracts. All individual calls and error handling are outsourced to the Façade Contract.

## Related Patterns
[Proxy Pattern](/Architectural%20Patterns/Proxy%20Pattern/README.md#context)

## Known Uses
[LATOPreICO](https://etherscan.io/address/0x459F7854776ED005B6Ec63a88F834fDAB0B6993e#code) (lines 252, 326ff), [Base and Satellite](https://github.com/maxwoe/solidity_patterns/tree/master/maintenance/satellite)
