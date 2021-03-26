import { action, observable } from 'mobx';
import { IStores } from 'stores';
import { statusFetching } from '../constants';
import { StoreConstructor } from './core/StoreConstructor';
import { IPlayerCard } from './SoccerPlayersList';
import * as blockchain from '../blockchain-old';

export class BuySoccerPlayer extends StoreConstructor {
  @observable public currentPlayer: IPlayerCard;

  @observable public status: statusFetching = 'init';
  @observable public actionStatus: statusFetching = 'init';
  @observable public txId: string;
  @observable public error: string;

  constructor(stores: IStores) {
    super(stores);
  }

  @action.bound
  buy() {
    this.actionStatus = 'fetching';

    return new Promise(async (resolve, reject) => {
      try {
        if (
          Number(this.stores.user.balance) <
          Number(this.currentPlayer.sellingPrice)
        ) {
          throw new Error('Your balance is not enough to buy');
        }

        const res = await blockchain.buyPlayerById({
          id: this.currentPlayer.internalPlayerId,
          price: this.currentPlayer.sellingPrice,
          signer: this.stores.user.address,
        });

        this.txId = res.transaction.id;

        if (res.status === 'called' || res.status === 'call') {
          this.stores.soccerPlayers.updatePlayerCard(
            this.currentPlayer.internalPlayerId,
          );

          this.actionStatus = 'success';

          setTimeout((r) => resolve(r), 2000);

          return;
        }

        this.error = 'Transaction failed';

        this.actionStatus = 'error';
        reject();
      } catch (e) {
        console.error(e);
        this.error = e.message;

        this.actionStatus = 'error';

        reject(e.message);
      }
    });
  }

  @action.bound
  initPlayer(player: IPlayerCard) {
    this.currentPlayer = player;
    this.status = 'success';

    blockchain.getPlayerById(player.internalPlayerId).then(player => {
      this.currentPlayer = player;

      return Promise.resolve(player);
    });
  }

  @action.bound
  clear() {
    this.currentPlayer = null;
    this.status = 'init';
    this.actionStatus = 'init';
    this.txId = '';
    this.error = '';
  }
}
