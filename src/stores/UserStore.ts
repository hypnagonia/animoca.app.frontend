import { action, autorun, observable } from 'mobx';
import { IStores } from 'stores';
import { statusFetching } from '../constants';
import * as blockchain from '../blockchain';
import { Magic } from 'magic-sdk';
import { StoreConstructor } from './core/StoreConstructor';
import { sleep } from '../utils';

// const { Harmony: Index } = require('@harmony-js/core');
const { ChainID } = require('@harmony-js/utils');

const isMainnet = !!(+process.env.MAINNET)

const magic = new Magic('pk_live_0E839FF643A591CC', {
  network: {
    rpcUrl: blockchain.RPC_URL,
    chainId: isMainnet ? Number(ChainID.HmyMainnet) : Number(ChainID.HmyTestnet),
    chainType: 'HARMONY',
  } as any,
});

// @ts-ignore
window.rpcProvider = magic.rpcProvider;

const defaults = {};

export enum WALLET_TYPE {
  ONE_WALLET = 'ONE_WALLET',
  MAGIC_WALLET = 'MAGIC_WALLET',
}

export class UserStoreEx extends StoreConstructor {
  public stores: IStores;
  @observable public isAuthorized: boolean;
  @observable public status: statusFetching = 'init';
  redirectUrl: string;

  private onewallet: any;
  @observable public isOneWallet = false;
  @observable public isLogged = false;

  @observable public walletType: WALLET_TYPE;

  @observable public address: string;
  @observable public balance: string = '0';

  @observable metadata: any = {};
  @observable email = '';

  constructor(stores: IStores) {
    super(stores);

    setInterval(async () => {
      if (!this.isOneWallet) {
        this.initOneWallet();
      }

      if (this.isAuthorized) {
        // this.metadata = await this.getMetaData();
        const res = await blockchain.getBalance(this.address);
        this.balance = res && res.result;
      }
    }, 3000);

    this.firstInit();
  }

  @action.bound
  initOneWallet() {
    // @ts-ignore
    this.isOneWallet = window.onewallet && window.onewallet.isOneWallet;
    // @ts-ignore
    this.onewallet = window.onewallet;
  }

  @action.bound
  public async firstInit() {
    try {
      if (!this.isAuthorized) {
        const session = localStorage.getItem('harmony_session');

        const sessionObj = JSON.parse(session);

        if (sessionObj && sessionObj.address) {
          switch (sessionObj.walletType) {
            case WALLET_TYPE.MAGIC_WALLET:
              this.status = 'fetching';

              const res = await magic.user.isLoggedIn();

              this.isAuthorized = res;

              if (this.isAuthorized) {
                this.address = sessionObj.address;
                this.walletType = sessionObj.walletType;
                await this.initMetaData();
              }
              break;

            case WALLET_TYPE.ONE_WALLET:
              this.status = 'fetching';

              let count = 0;
              this.initOneWallet();

              while (!this.isOneWallet && count < 5) {
                await sleep(1000);
                this.initOneWallet();
                count++;
              }

              await this.signIn(null, WALLET_TYPE.ONE_WALLET);
              break;
          }
        }
      }
    } catch (e) {
      console.error(e);
    }

    this.status = 'success';

    if (this.isAuthorized) {
      this.stores.tokenList.getList();
      blockchain
        .getBalance(this.address)
        .then(res => (this.balance = res && res.result));
    }
  }

  @action.bound
  public signIn(email: string, walletType: WALLET_TYPE) {
    this.walletType = walletType;

    switch (walletType) {
      case WALLET_TYPE.MAGIC_WALLET:
        return this.stores.metamask.signIn().then(r => {
          this.isAuthorized = true;
          this.address = this.stores.metamask.ethAddress
        }).then(this.stores.metamask.getBalances).then(r => {
          this.balance = this.stores.metamask.erc20Balance
        })

      case WALLET_TYPE.ONE_WALLET:
        return this.onewallet.getAccount().then(account => {
          this.address = account.address;
          this.isAuthorized = true;

          this.syncLocalStorage();

          blockchain
            .getBalance(this.address)
            .then(res => (this.balance = res && res.result));

          return Promise.resolve();
        });
    }
  }

  @action.bound
  initMetaData = async () => {
    this.metadata = await this.getMetaData();
    this.email = this.metadata.email;
    this.address = this.metadata.publicAddress;

    blockchain
      .getBalance(this.address)
      .then(res => (this.balance = res && res.result));
  };

  @action.bound
  public signOut() {
    // if(!this.isAuthorized) {
    //   return;
    // }

    if (this.walletType === WALLET_TYPE.ONE_WALLET) {
      return this.onewallet
        .forgetIdentity()
        .then(() => {
          this.walletType = null;
          this.address = null;
          this.isAuthorized = false;
          this.balance = '0';

          this.syncLocalStorage();

          return Promise.resolve();
        })
        .catch(err => {
          console.error(err.message);
        });
    }

    if (this.walletType === WALLET_TYPE.MAGIC_WALLET) {
      return magic.user.logout().then(() => {
        this.walletType = null;
        this.address = null;
        this.isAuthorized = false;
        this.balance = '0';

        this.syncLocalStorage();

        return Promise.resolve();
      });
    }
  }

  private syncLocalStorage() {
    localStorage.setItem(
      'harmony_session',
      JSON.stringify({
        address: this.address,
        walletType: this.walletType,
      }),
    );
  }

  @action public reset() {
    Object.assign(this, defaults);
  }

  // Magic

  getMetaData = async () => {
    const metadata = await magic.user.getMetadata();
    console.log('Metadata:', metadata);

    return metadata;
  };
}
