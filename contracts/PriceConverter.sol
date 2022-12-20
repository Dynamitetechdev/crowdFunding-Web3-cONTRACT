//SPDX-License-Identifier: MIT
pragma solidity >=0.5.8 <0.9.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPriceFeed(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        return uint256(answer * 1e18);
    }

    function getCoversionRate(
        uint256 ethInputtedAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getPriceFeed(priceFeed);
        uint256 ethAmountInUsd = (ethPrice * ethInputtedAmount) / 1e18;
        return ethAmountInUsd;
    }
}
