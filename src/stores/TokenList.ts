import { action, autorun, computed, observable } from "mobx";
import { IStores } from "stores";
import { statusFetching } from "../constants";
import { StoreConstructor } from "./core/StoreConstructor";
import * as blockchain from "../blockchain";
import { WALLET_TYPE } from "./UserStore";

const score = {
  "Common": 1,
  "Rare": 2,
  "Epic": 4,
  "Legendary": 20
};

export interface ITokenCard {
  id: string;
  name: string;
  description: string;
  image: string;
  youtube_url: string;
  collection_id: string;
  collection_url: string;
  external_url: string;
  license: string;
  playerId?: string;
  core: any;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

const sortByRarity = (a, b) => {
  return score[b.core.rarity.value] - score[a.core.rarity.value];
};

export class TokenList extends StoreConstructor {
  @observable public list: Array<ITokenCard> = [];
  @observable public status: statusFetching = "init";
  @observable public actionStatus: statusFetching = "init";
  @observable public error: string = "";
  @observable public txId: string = "";

  constructor(stores: IStores) {
    super(stores);

    autorun(() => {
      if (this.stores.user.address) {
        console.log("autorun");
        this.getList();
        this.formData.address = this.stores.user.address;
      }
      /* if (!this.stores.user.address && this.list.length) {
         this.list = []
       }*/
    });
  }

  @observable boxId = "3";

  defaultDormData = {
    address: "",
    playerId: "",
    boxId: "3",
    platform: "ios",
    amount: 1
  };

  @observable formData = this.defaultDormData;

  boxes = [
    { id: "3", total: 60, allow: 20, price: 250 }
    // { id: '2', total: 60, allow: 20, price: 200 },
    // { id: '3', total: 25, allow: 5, price: 300 },
    // { id: '4', total: 5, allow: 5, price: 400 },
  ];

  @computed
  get selectedBox() {
    return this.boxes.find(box => box.id === this.boxId);
  }

  @computed
  get total() {
    if (this.formData.amount) {
      return this.selectedBox.price * this.formData.amount;
    } else {
      return 0;
    }
  }

  @computed
  get totalByRarity() {
    return Object.keys(score).reduce((o, rarity) => {
      o[rarity] = this.list.filter(e => e.core.rarity.value === rarity).length;
      return o;
    }, {});
  }

  @computed
  get totalSets() {
    const amountForSet = {
      "Common": 20,
      "Rare": 10,
      "Epic": 5,
      "Legendary": 1
    };

    return Object.keys(score)
      .map(k => ~~(this.list.filter(e => e.core.rarity.value === k).length / amountForSet[k]))
      .reduce((a, b) => {
        return a + b;
      }, 0);
  }

  @computed
  get filteredList() {
    return this.list;
  }

  @observable newCardsList: Array<ITokenCard> = [];
  @observable hasNewCards = false;

  @action.bound
  clearNewCards = () => {
    this.hasNewCards = false;
    this.newCardsList = [];
  };

  @computed
  get canClaim() {
    if (!this.list.length) {
      return false;
    }

    return this.list.map(e => e.playerId).filter(e => !e).length > 0;
  }

  @computed
  get canClaimAll() {
    if (!this.list.length) {
      return false;
    }

    const s = new Set();
    this.list.map(e => e.playerId)
      .filter(e => e !== "")
      .forEach(e => s.add(e));

    return s.size > 1;
  }

  @action.bound
  getList = async () => {
    if (!this.stores.user.address) {
      return;
    }

    if (this.status === "first_fetching") {
      return;
    }

    if (this.status === "init") {
      this.status = "first_fetching";
    } else {
      this.status = "fetching";
    }

    try {
      const res = await blockchain.getTokens(this.stores.user.address);

      let list = res.filter(r => !!r);

      if (this.status !== "first_fetching" && list.length > this.list.length) {
        const diffCount = list.length - this.list.length;

        this.newCardsList = list.slice(list.length - diffCount, list.length);

        this.hasNewCards = true;
      }

      this.list = list.sort(sortByRarity);

      console.log("list", list);

      this.status = "success";
    } catch (e) {
      console.error(e);
      this.status = "error";
    }
  };

  @action.bound
  async claimCards(playerId, claimAll = false) {
    console.log({claimAll})
    const tokens = claimAll
      ? this.list
        .map(e => e.id)
      : this.list
        .filter(e => !e.playerId)
        .map(e => e.id);

    if (this.stores.user.walletType === WALLET_TYPE.MAGIC_WALLET) {
      return blockchain.setPlayerIDMagicWallet({
        address: this.stores.user.address,
        tokens,
        playerId
      });
    } else {
      return blockchain.setPlayerID({
        address: this.stores.user.address,
        tokens,
        playerId
      });
    }
  }

  @action.bound
  async buyLootBox() {
    this.actionStatus = "fetching";

    return new Promise(async (resolve, reject) => {
      try {
        if (Number(this.stores.user.balance) < Number(this.total) * 1e18) {
          throw new Error("Your balance is not enough to buy");
        }

        let res;

        if (this.stores.user.walletType === WALLET_TYPE.MAGIC_WALLET) {
          res = await blockchain.purchase({
            address: this.stores.user.address,
            quantity: this.formData.amount,
            amount: String(this.total),
            playerId: this.formData.playerId
          });
        }

        if (this.stores.user.walletType === WALLET_TYPE.ONE_WALLET) {
          res = await blockchain.purchaseOneWallet({
            address: this.stores.user.address,
            quantity: this.formData.amount,
            amount: String(this.total),
            playerId: this.formData.playerId
          });
        }

        this.txId = res.result.transactionHash || res.result.id;

        if (!res.error) {
          this.actionStatus = "success";

          setTimeout(async () => {
            await this.getList();

            resolve();
          }, 2000);


          return;
        }

        this.error = res.error;

        this.actionStatus = "error";
        reject(res.error);
      } catch (e) {
        console.error(e);
        this.error = e.message;

        this.actionStatus = "error";

        reject(e.message);
      }
    });
  }

  @action.bound
  clear() {
    this.actionStatus = "init";
    this.formData = this.defaultDormData;
  }
}
