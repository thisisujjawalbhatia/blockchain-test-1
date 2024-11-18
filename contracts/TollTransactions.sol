// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TollTransactions {
    // Structure to store a single transaction
    struct Transaction {
        uint256 transactionId;  // Unique ID for the transaction
        address sender;         // Address of the sender
        address recipient;      // Address of the recipient
        uint256 amount;         // Amount transferred
        uint256 timestamp;      // Time of transaction
    }

    // Array to store all transactions
    Transaction[] private transactions;

    // Event emitted when a transaction is stored
    event TransactionStored(uint256 transactionId, address indexed sender, address indexed recipient, uint256 amount, uint256 timestamp);

    // Function to store a new transaction
    function storeTransaction(address recipient, uint256 amount) public {
        require(recipient != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than zero");

        uint256 transactionId = transactions.length + 1; // Generate transaction ID

        transactions.push(Transaction({
            transactionId: transactionId,
            sender: msg.sender,
            recipient: recipient,
            amount: amount,
            timestamp: block.timestamp
        }));

        emit TransactionStored(transactionId, msg.sender, recipient, amount, block.timestamp);
    }

    // Function to get the total number of transactions
    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }

    // Function to get all transactions for a specific user (sender or recipient)
    function getTransactionsByUser(address user) public view returns (Transaction[] memory) {
        require(user != address(0), "Invalid user address");

        uint256 count = 0;
        for (uint256 i = 0; i < transactions.length; i++) {
            if (transactions[i].sender == user || transactions[i].recipient == user) {
                count++;
            }
        }

        Transaction[] memory userTransactions = new Transaction[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < transactions.length; i++) {
            if (transactions[i].sender == user || transactions[i].recipient == user) {
                userTransactions[index] = transactions[i];
                index++;
            }
        }

        return userTransactions;
    }

}
