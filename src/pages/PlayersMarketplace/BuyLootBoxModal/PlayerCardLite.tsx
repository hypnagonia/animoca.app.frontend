import * as React from 'react';
import { Box } from 'grommet';
import { DisableWrap, Icon, Text } from 'components/Base';
import { observer } from 'mobx-react-lite';
import * as styles from './card.styl';
import { IEmptyPlayerCard, IPlayerCard } from 'stores/SoccerPlayersList';
import {
  formatWithTwoDecimals,
  ones,
  truncateAddressString,
} from '../../../utils';
import { EXPLORER_URL, getBech32Address } from '../../../blockchain';

const DataItem = (props: {
  text: any;
  label: string;
  icon: string;
  iconSize: string;
  color?: string;
  link?: string;
}) => {
  return (
    <Box direction="row" justify="between" gap="10px">
      <Box direction="row" justify="start" align="center" gap="5px">
        <Icon
          glyph={props.icon}
          size={props.iconSize}
          color={props.color || '#1c2a5e'}
          style={{ marginBottom: 2, width: 20 }}
        />
        <Text color="#1c2a5e" size={'small'}>
          {props.label}
        </Text>
      </Box>
      {props.link ? (
        <a
          href={props.link}
          target="_blank"
          style={{ color: props.color || '#1c2a5e' }}
        >
          <Text color={props.color || '#1c2a5e'} size={'small'} bold={true}>
            {props.text}
          </Text>
        </a>
      ) : (
        <Text color={props.color || '#1c2a5e'} size={'small'} bold={true}>
          {props.text}
        </Text>
      )}
    </Box>
  );
};

export interface IPlayerCardProps {
  player?: IPlayerCard;
  emptyPlayer?: IEmptyPlayerCard;
}

export const PlayerCardLite = observer<IPlayerCardProps>(props => {
  const bech32Owner = props.player ? getBech32Address(props.player.owner) : '';

  return (
    <Box
      className={styles.cardContainerLite}
      height="100%"
      align="center"
      background=""
    >
      <img
        style={{ padding: '10% 0', height: '80%' }}
        src="/landing/pricing/3.png"
      />

      {props.player ? (
        <Box className={styles.infoBlock} fill={true} gap="10px" pad="medium">
          <DataItem
            icon="ONE"
            iconSize="16px"
            text={
              (props.player
                ? formatWithTwoDecimals(ones(props.player.sellingPrice))
                : '...') + ' ONEs'
            }
            label="Price:"
          />
          <DataItem
            icon="User"
            iconSize="16px"
            text={props.player ? truncateAddressString(bech32Owner) : '...'}
            label="Owner:"
            link={EXPLORER_URL + `/address/${bech32Owner}`}
          />
          <DataItem
            icon="Refresh"
            iconSize="14px"
            text={props.player ? props.player.transactionCount : '...'}
            label="Transactions:"
          />
        </Box>
      ) : (
        <Box
          className={styles.infoBlockEmpty}
          fill={true}
          gap="10px"
          pad="medium"
          justify="center"
        >
          <DataItem
            icon="Refresh"
            iconSize="14px"
            text={''}
            label="Loading data from blockchain..."
          />
        </Box>
      )}

      <Box className={styles.buyButton} fill={true}>
        <Text color="white" size={'medium'}>
          {(props.player
            ? formatWithTwoDecimals(ones(props.player.sellingPrice))
            : '...') + ' ONEs'}
        </Text>
      </Box>
    </Box>
  );
});
