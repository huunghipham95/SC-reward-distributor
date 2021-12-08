/**
 * Creator Chain 1.0
 *
 * Description.
 *
 * @link   https://github.com/creator-blockchains/creator-token-distributor
 * @deploy-angel.js   a script file to deploy of locker contract
 * @author Creator.
 * @since  Aug 25, 2021
 */

const fs = require('fs');
const path = require('path');
const hre = require('hardhat');
require('dotenv').config();
const artifacts = hre.artifacts;

const BN = web3.utils.BN;
const TokenLocker = artifacts.require('TokenLocker.sol');


async function main() {
    const accounts = await web3.eth.getAccounts();
    const deployer = accounts[0];
    console.log(`[CTR] Angel's deployer address: ${deployer}`);

    const gasPrice = new BN(22).mul(new BN(10).pow(new BN(9)));
    console.log(
        `[CTR] Angel of sending transactions with gas price: ${gasPrice.toString(10)} (${gasPrice
            .div(new BN(10).pow(new BN(9)))
            .toString(10)} Gweis)`
    );

    const locker = await TokenLocker.new(
        process.env.CREATOR_DISTR_TOKEN_ADDRESS,
        {
        gasPrice: gasPrice,
    });

    console.log(`[CTR] Deploy new Angel's locker at ${locker.address}`);
    console.warn(`[CTR] Note: Copy Angel's contract address into file cmd/config.json`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
