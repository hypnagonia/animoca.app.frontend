import * as React from 'react';
import { Box } from 'grommet';
import { Icon, Text } from 'components/Base';
import { observer } from 'mobx-react-lite';
import * as styles from './card.styl';
import { formatWithTwoDecimals, ones } from 'utils';
import { useStores } from '../../../stores';

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

export interface IPlayerCardProps {}

export const PlayerCardLite = observer<IPlayerCardProps>(props => {
  const { tokenList } = useStores();

  return (
    <Box
      className={styles.cardContainerLite}
      height="100%"
      align="center"
      background=""
    >
      <img
        style={{ padding: '10% 0', height: '80%', maxHeight: 131, maxWidth:156 }}
        src="/Player.png"
      />

      <Box className={styles.infoBlock} fill={true} gap="10px" pad="medium">
        <DataItem
          icon="Refresh"
          iconSize="14px"
          text={tokenList.formData.amount}
          label="Amount:"
        />
        <DataItem
          icon="ONE"
          iconSize="16px"
          text={formatWithTwoDecimals(tokenList.selectedBox.price) + ' ONEs'}
          label="Price:"
        />
      </Box>

      <Box className={styles.buyButton} fill={true}>
        <Text color="white" size={'medium'}>
          {formatWithTwoDecimals(tokenList.total) + ' ONEs'}
        </Text>
      </Box>
    </Box>
  );
});
