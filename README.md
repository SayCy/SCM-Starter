# Assessment Contract

This Solidity smart contract is designed to manage an account with age restriction and provide basic banking functionalities such as deposit and withdrawal.

## Features

- **Deposit**: Allows the owner to deposit funds into the contract.
- **Withdrawal**: Allows the owner to withdraw funds from the contract, with an age restriction of 21 years or older.
- **Balance Inquiry**: Provides a function to check the current balance of the contract.

## Usage

### Requirements

- Solidity ^0.8.9

### Installation

No installation is required for this smart contract. Simply copy the code and deploy it using your preferred Ethereum development environment.

### Contract Deployment

After cloning the github, you will want to do the following to get the code running on your computer.

1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/
### Functions

#### `deposit(uint256 _amount)`

Allows the owner to deposit funds into the contract.

Parameters:
- `_amount`: The amount of funds to deposit.

#### `withdraw(uint256 _withdrawAmount)`

Allows the owner to withdraw funds from the contract, with an age restriction of 21 years or older.

Parameters:
- `_withdrawAmount`: The amount of funds to withdraw.



