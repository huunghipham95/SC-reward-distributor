require('@nomiclabs/hardhat-truffle5');
require('@nomiclabs/hardhat-web3');
require('@nomiclabs/hardhat-ganache');
require('solidity-coverage');
require('@nomiclabs/hardhat-etherscan');
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const INFURA_API_KEY = process.env.INFURA_API_KEY;

module.exports = {
  defaultNetwork: 'hardhat',

  networks: {
    develop: {
      url: 'http://127.0.0.1:8645',
      gas: 'auto',
      timeout: 200000,
    },
    hardhat: {
      forking: {
        url: 'https://bsc-dataseed.binance.org/',
      },
    },
  },

  solidity: {
    version: '0.6.12',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  paths: {
    sources: './contracts',
    tests: './test/',
  },

  mocha: {
    timeout: 0,
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
};

if (PRIVATE_KEY !== undefined) {
  module.exports.networks.kovan = {
    url: `https://kovan.infura.io/v3/${INFURA_API_KEY}`,
    accounts: [PRIVATE_KEY],
    timeout: 20000,
  };

  module.exports.networks.rinkeby = {
    url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
    accounts: [PRIVATE_KEY],
    timeout: 20000,
  };

  module.exports.networks.ropsten = {
    url: `https://ropsten.infura.io/v3/${INFURA_API_KEY}`,
    accounts: [PRIVATE_KEY],
    timeout: 20000,
  };

  module.exports.networks.mainnet = {
    url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
    accounts: [PRIVATE_KEY],
    timeout: 20000,
  };

  module.exports.networks.bsc_testnet = {
    url: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
    accounts: [PRIVATE_KEY],
    timeout: 20000,
  };

  module.exports.networks.bsc = {
    url: `https://bsc-dataseed.binance.org/`,
    accounts: [PRIVATE_KEY],
    timeout: 20000,
  };
}
