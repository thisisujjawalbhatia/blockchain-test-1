
const Web3 = require('web3');
const { abi } = require({
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "userPublicKey",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "tollBoothPublicKey",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "TransactionCompleted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "transactions",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "userPublicKey",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tollBoothPublicKey",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_userPublicKey",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_tollBoothPublicKey",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "makeTransaction",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "getTransaction",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "userPublicKey",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tollBoothPublicKey",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }); 
const CONTRACT_ADDRESS = '0xAF9444d1E76EDeA8e0aeE211c34e876F70829634';

const web3 = new Web3('http://127.0.0.1:7545'); // Replace with your RPC URL

const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

async function registerVehicle(vehicleOwner, senderAddress, privateKey) {
    const tx = await contract.methods.registerVehicle(vehicleOwner);
    return sendTransaction(tx, senderAddress, privateKey);
}

async function registerTollBooth(tollBoothOwner, tollAmount, senderAddress, privateKey) {
    const tx = await contract.methods.registerTollBooth(tollBoothOwner, tollAmount);
    return sendTransaction(tx, senderAddress, privateKey);
}

async function payToll(vehicleOwner, tollBoothOwner, senderAddress, privateKey, tollAmount) {
    const tx = await contract.methods.payToll(vehicleOwner, tollBoothOwner).send({
        from: senderAddress,
        value: tollAmount,
    });
    return sendTransaction(tx, senderAddress, privateKey);
}

async function checkTollAmount(tollBoothOwner) {
    return await contract.methods.checkTollAmount(tollBoothOwner).call();
}

async function sendTransaction(tx, senderAddress, privateKey) {
    const txData = {
        to: tx._parent._address,
        data: tx.encodeABI(),
        gas: await tx.estimateGas({ from: senderAddress }),
    };

    const signedTx = await web3.eth.accounts.signTransaction(txData, privateKey);
    return await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
}

module.exports = {
    registerVehicle,
    registerTollBooth,
    payToll,
    checkTollAmount,
};


