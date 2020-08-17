import {
  connectToOneWallet,
  contractSale,
  contractToken,
  hmy,
  options,
} from './sdk';
const { hexToNumber, numberToHex } = require('@harmony-js/utils');

interface IParams {
  address: string;
  quantity: number;
  amount: string;
  lotId?: number;
}

export const purchase = (params: IParams): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const addrHex = hmy.crypto.getAddress(params.address).checksum;

      // connectToOneWallet(contractToken.wallet, params.address, reject);

      const recipient = addrHex;
      // const recipient = "0x0B585F8DaEfBC68a311FbD4cB20d9174aD174016";
      const lotId = params.lotId || 0;
      const quantity = params.quantity;
      const tokenAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
      const maxTokenAmount = params.amount;
      const minConversionRate = '0xDE0B6B3A7640000'; // equivalent to 1e+18
      const extData = '0x736f6d65';

      const ONE = '000000000000000000';

      let tx = await contractSale.methods.purchaseFor(
        recipient,
        lotId,
        quantity,
        tokenAddress,
        maxTokenAmount,
        hexToNumber(minConversionRate),
        extData,
      );

      let { txPayload } = tx.transaction;

      txPayload.from = params.address;
      txPayload.gasLimit = options.gasLimit;
      txPayload.gasPrice = '1000000000';
      txPayload.value = numberToHex(params.amount + ONE);

      // @ts-ignore
      window.rpcProvider.sendAsync(
        {
          id: 42,
          method: 'hmy_sendTransaction',
          params: txPayload,
        },
        (err, res) => {
          console.log('state full contract call result', res);

          resolve(res);
        },
      );
    } catch (e) {
      console.error(e);

      reject(e);
    }
  });
};
