import {
  connectToOneWallet,
  contractSale,
  contractToken,
  contractJsonSale,
  hmy,
  options,
  RPC_URL
} from './sdk';
const { hexToNumber, numberToHex } = require('@harmony-js/utils');
import Web3 from 'web3'
const BN = require('bn.js');
const isMainnet = !!(+process.env.MAINNET)
console.log({RPC_URL})
const web3 = new Web3(RPC_URL);

interface IParams {
  address: string;
  quantity: number;
  amount: string;
  playerId: string;
  lotId?: number;
}

export const purchaseOneWallet = (params: IParams): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const addrHex = hmy.crypto.getAddress(params.address).checksum;

      connectToOneWallet(contractSale.wallet, addrHex, reject);

      const recipient = addrHex;
      // const recipient = "0x0B585F8DaEfBC68a311FbD4cB20d9174aD174016";
      //const lotId = params.lotId || 0;
      //const quantity = params.quantity;
      //const tokenAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
      //const maxTokenAmount = params.amount;
      //const minConversionRate = '0xDE0B6B3A7640000'; // equivalent to 1e+18
      //const extData = params.playerId;

      const ONE = '000000000000000000';

      const value = numberToHex(params.amount + ONE);

      let options2 = { gasPrice: 1000000000, gasLimit: 6721900, value };

      const res = await contractSale.methods
        .purchaseItem(
          recipient,
        )
        .send(options2);

      if (res.status !== 'called') {
        resolve({
          result: res.transaction,
          error: 'Transaction is rejected',
        });
      }

      resolve({ result: res.transaction });
    } catch (e) {
      console.error(e);

      reject(e);
    }
  });
};

export const purchase = (params: IParams): Promise<any> => {
  console.log('purchase', params)
  return new Promise(async (resolve, reject) => {
    try {
      const addrHex = hmy.crypto.getAddress(params.address).checksum;

      // connectToOneWallet(contractToken.wallet, params.address, reject);

      const recipient = addrHex;

      const contractJson = contractJsonSale
      const contract = new web3.eth.Contract(contractJson.abi, isMainnet ? process.env.TOKEN : process.env.TESTNET_TOKEN);
      const needGas = await contract.methods
        .purchaseItem(recipient)
        .estimateGas({
          gas: 1000000000,
          value: web3.utils.toWei("100", "ether"),
        });

      console.log({needGas})
      const response = await contract.methods
        .purchaseItem(recipient)
        .send({
        from: recipient,
        value: web3.utils.toWei("100", "ether"),
        gas: needGas,
        gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
      }).on("transactionHash",
          async (txHash) => {
            resolve(txHash);
          }
        );

      console.log(response);

    } catch (e) {
      console.error(e);

      reject(e);
    }
  });
};
