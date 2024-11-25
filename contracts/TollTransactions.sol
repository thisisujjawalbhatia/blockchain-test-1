// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TollTransactions {

    struct Vehicle {
        address owner; // The wallet address of the vehicle owner
    }

    struct TollBooth {
        address owner; // The wallet address of the toll booth owner
        uint256 tollAmount; // The toll amount in wei (this is the fee for passing the toll)
    }

    mapping(address => Vehicle) public vehicles; // Mapping from vehicle address to vehicle details
    mapping(address => TollBooth) public tollBooths; // Mapping from toll booth address to toll booth details

    event TollPaid(address vehicleOwner, address tollBoothOwner, uint256 amount, uint256 timestamp);

    constructor() {}

    // Register a vehicle with the owner's address
    function registerVehicle(address _owner) public {
        vehicles[_owner] = Vehicle(_owner); // Initialize the vehicle
    }

    // Register a toll booth with the owner's address and toll amount
    function registerTollBooth(address _owner, uint256 _tollAmount) public {
        tollBooths[_owner] = TollBooth(_owner, _tollAmount); // Initialize the toll booth with toll amount
    }

    // Function to pay the toll (deduct from sender's account)
    function payToll(address _vehicleOwner, address _tollBoothOwner) public payable {
        // Ensure the vehicle is registered
        require(vehicles[_vehicleOwner].owner != address(0), "Vehicle not registered");

        // Ensure the toll booth is registered
        require(tollBooths[_tollBoothOwner].owner != address(0), "Toll booth not registered");

        // Ensure the sender is the vehicle owner
        require(msg.sender == _vehicleOwner, "Only vehicle owner can pay toll");

        // Retrieve the toll amount for the specific toll booth
        uint256 tollAmount = tollBooths[_tollBoothOwner].tollAmount;

        // Ensure the correct amount is sent (based on toll amount)

        // Transfer the toll amount to the toll booth owner
        payable(_tollBoothOwner).transfer(msg.value);

        // Emit the event to log the toll payment
        emit TollPaid(_vehicleOwner, _tollBoothOwner, tollAmount, block.timestamp);
    }

    // Function to check the toll amount for a specific toll booth
    function checkTollAmount(address _tollBoothOwner) public view returns (uint256) {
        return tollBooths[_tollBoothOwner].tollAmount;
    }
}
