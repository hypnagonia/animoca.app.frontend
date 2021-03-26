import { action, computed, observable } from 'mobx';
import { IStores } from 'stores';
import { statusFetching } from '../constants';
import { StoreConstructor } from './core/StoreConstructor';
import { IPlayerCard } from './SoccerPlayersList';
import * as blockchain from '../blockchain-old';

export class SendSoccerPlayer extends StoreConstructor {
  @observable public currentPlayer: IPlayerCard;

  @observable public status: statusFetching = 'init';
  @observable public actionStatus: statusFetching = 'init';
  @observable public txId: string;
  @observable public error: string;

  @observable public receiver: string = '';
  @observable public receiverTouched: boolean = false;

  // @computed
  // public get validateError() {
  //   if (!this.receiverTouched) {
  //     return '';
  //   }
  //
  //   if (this.receiver.length === 0) {
  //     return '';
  //   }
  //
  //   try {
  //     blockchain.checkAddress(this.receiver);
  //   } catch (e) {
  //     return e.message;
  //   }
  //
  //   return '';
  // }

  constructor(stores: IStores) {
    super(stores);
  }

  @action.bound
  send() {
    this.receiverTouched = true;

    this.actionStatus = 'fetching';

    return new Promise(async (resolve, reject) => {
      try {
        if (!blockchain.checkAddress(this.receiver)) {
          return reject();
        }

        const res = await blockchain.sendPlayerById({
          id: this.currentPlayer.internalPlayerId,
          receiver: this.receiver,
          signer: this.stores.user.address,
        });

        this.txId = res.transaction.id;

        if (res.status === 'called' || res.status === 'call') {
          this.stores.soccerPlayers.updatePlayerCard(
            this.currentPlayer.internalPlayerId,
          );

          this.actionStatus = 'success';

          //@ts-ignore
          setTimeout(() => resolve(), 2000);

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
    this.receiver = '';
    this.receiverTouched = false;
  }
}
