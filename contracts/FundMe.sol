//SPDX-License-Identifier: MIT
pragma solidity >=0.5.8 <0.9.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";
error FundMe_notOwner();

contract FundMe {
    address public i_ownerAddress;
    uint256 public MINIMUM_USD = 50 * 1e18;
    address[] public fundersAddressArray;

    using PriceConverter for uint256;

    mapping(address => uint) public getAmtPerFunder;

    AggregatorV3Interface public priceFeed;

    modifier onlyOwner() {
        if (msg.sender != i_ownerAddress) {
            revert FundMe_notOwner();
        } else {
            _;
        }
    }

    constructor(address PriceFeedAddress) {
        i_ownerAddress = msg.sender;
        priceFeed = AggregatorV3Interface(PriceFeedAddress);
    }

    function fundWallet() public payable {
        require(
            msg.value.getCoversionRate(priceFeed) >= MINIMUM_USD,
            "Send $50 eth, atleast"
        );
        fundersAddressArray.push(msg.sender);
        getAmtPerFunder[msg.sender] = msg.value;
    }

    function withdrawBalance() public onlyOwner {
        (bool withdrawSuccessful, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(
            withdrawSuccessful,
            "Funds Not Transferred or you are not the owner"
        );
        for (
            uint256 funderIndex = 0;
            funderIndex < fundersAddressArray.length;
            funderIndex++
        ) {
            address eachFundersArray = fundersAddressArray[funderIndex];
            getAmtPerFunder[eachFundersArray] = 0;
        }
        fundersAddressArray = new address[](0);
    }

    receive() external payable {
        fundWallet();
    }

    fallback() external payable {
        fundWallet();
    }
}
