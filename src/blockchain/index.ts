const { Harmony } = require('@harmony-js/core');
const { ChainID, ChainType } = require('@harmony-js/utils');
const { getAddress } = require('@harmony-js/crypto');

export const EXPLORER_URL = 'https://explorer.harmony.one/#';

const GAS_LIMIT = 103802;
const GAS_PRICE = 1000000000;

const hmy = new Harmony('https://api.s0.b.hmny.io', {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyTestnet,
});

const contractJson = require('./SoccerPlayers.json');
const contractAddrTestnet = '0x7943381adde30f216cAEb9b9d1927522d7E5476f';
// const contractAddr = '0x3e37A9C5F2ec88B7566ae68A5D38707E5e25f243';

const soccerPlayers = hmy.contracts.createContract(
  contractJson.abi,
  contractAddrTestnet,
);

const a = soccerPlayers.wallet.createAccount();

// soccerPlayers.wallet.signTransaction = () => { console.log('SIGN') }

const options = {
  gasPrice: GAS_PRICE,
  gasLimit: GAS_LIMIT,
};

const instance = soccerPlayers.methods;

export const getList = async () => {
  let total = await instance.totalSupply().call(options);

  const cards = [];

  for (let i = 0; i < total; i++) {
    let res = await instance.getPlayer(i).call(options);
    cards.push(res);
  }

  return cards;
};

export const getPlayerById = async id => {
  const res = await instance.getPlayer(id).call(options);

  return res;
};

export const getTotalPlayers = async () => {
  const res = await instance.totalSupply().call(options);

  return res;
};

export const buyPlayerById = (params: {
  id: string;
  price: string;
  signer: string;
}): Promise<{ status: string; transaction: { id: string } }> => {
  return new Promise(async (resolve, reject) => {
    try {
      soccerPlayers.wallet.defaultSigner = params.signer;

      soccerPlayers.wallet.signTransaction = async tx => {
        try {
          tx.from = params.signer;
          // @ts-ignore
          const signTx = await window.harmony.signTransaction(tx);

          // const [sentTx, txHash] = await signTx.sendTransaction();

          // await sentTx.confirm(txHash);

          // resolve(txHash);
          return signTx;
        } catch (e) {
          console.error(e);
          reject(e);
        }

        return null;
      };

      const res = await soccerPlayers.methods
        .purchase(params.id)
        .send({ ...options, value: params.price });

      resolve(res);
    } catch (e) {
      console.error(e);

      reject(e);
    }
  });
};

export const getBech32Address = address =>
  hmy.crypto.getAddress(address).bech32;

export const getBalance = address => {
  return hmy.blockchain.getBalance({ address });
};

export const checkAddress = address => {
  return getAddress(address).basicHex;
};

export const sendPlayerById = (params: {
  id: string;
  signer: string;
  receiver: string;
}): Promise<{ status: string; transaction: { id: string } }> => {
  return new Promise(async (resolve, reject) => {
    try {
      soccerPlayers.wallet.defaultSigner = params.signer;

      soccerPlayers.wallet.signTransaction = async tx => {
        try {
          tx.from = params.signer;
          // @ts-ignore
          const signTx = await window.harmony.signTransaction(tx);

          return signTx;
        } catch (e) {
          console.error(e);
          reject(e);
        }

        return null;
      };

      const toAddressHex = getAddress(params.receiver).basicHex;

      const res = await soccerPlayers.methods
        .transfer(toAddressHex, params.id)
        .send({ ...options });

      resolve(res);
    } catch (e) {
      console.error(e);

      reject(e);
    }
  });
};
