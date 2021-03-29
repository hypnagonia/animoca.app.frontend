import React from 'react';
import {Box} from 'grommet';
import {Title, Text, Icon} from 'components/Base';
import {observer} from 'mobx-react-lite';
import {useStores} from 'stores';
import {PlayerCardLite} from './PlayerCardLite';
import * as styles from './card.styl';
import {EXPLORER_URL} from '../../../blockchain';
import {Spinner} from 'ui';
import {truncateAddressString} from '../../../utils';
import {PlayerCardLiteOwner} from './PlayerCardLiteOwner';
import {useMediaQuery} from 'react-responsive';

interface IBuyPlayerModalProps {
}

const Description = observer(() => {
  const {tokenList: buyPlayer} = useStores();

  const isSmallMobile = useMediaQuery({query: '(max-width: 678px)'});

  let icon = () => <Icon style={{width: 50}} glyph="RightArrow" />;
  let description = 'Approval';

  switch (buyPlayer.actionStatus) {
    case 'init':
      icon = () =>
        isSmallMobile ? null : (
          <Icon
            style={{height: '110px', width: 'auto'}}
            className={styles.sendArrow}
            glyph="SendArrow"
          />
        );
      description =
        'Get your hands on ONE of only 100 NFTs. The Centipede series, created by the legendary Dona Bailey, carry a special spirit and set the industry standard for decades. Own a piece of history today.';
      break;

    case 'fetching':
      icon = () => <Spinner />;
      description = 'Sending';
      break;

    case 'error':
      icon = () => <Icon size="50" style={{width: 50}} glyph="Alert" />;
      description = buyPlayer.error;
      break;

    case 'success':
      icon = () => <Icon size="50" style={{width: 50}} glyph="CheckMark" />;
      description = 'Success';
      break;
  }


  return (
    <Box
      direction="column"
      align="center"
      justify="center"
      style={{maxWidth: 340, margin: '20px 0'}}
    >
      {icon()}
      <Box className={styles.description}>
        <Text>{description}</Text>
        {buyPlayer.txId ? (
          <a
            style={{marginTop: 10}}
            href={EXPLORER_URL + `/tx/${buyPlayer.txId}`}
            target="_blank"
          >
            Tx id: {truncateAddressString(buyPlayer.txId)}
          </a>
        ) : null}

      </Box>
    </Box>
  );
});

export const BuyLootBoxModal = observer<IBuyPlayerModalProps>(props => {
  const {tokenList: buyPlayer} = useStores();
  const isMobile = useMediaQuery({query: '(max-width: 1000px)'});
  const isSmallMobile = useMediaQuery({query: '(max-width: 678px)'});

  if (isSmallMobile) {
    return (
      <Box
        direction="column"
        align="center"
        justify="start"
        gap="20px"
        pad="medium"
      >
        <Title style={{textAlign: 'center'}}>Buy</Title>
        <PlayerCardLite />
        <Description />
      </Box>
    );
  }

  return (
    <Box
      pad={{
        horizontal: isMobile ? 'small' : 'large',
        top: isSmallMobile ? '' : 'large',
      }}
      className={styles.modalContainer}
    >
      <Title style={{textAlign: 'center'}}>Buy</Title>
      <Box
        margin={{vertical: isMobile ? '' : 'large'}}
        direction="row"
        align="center"
        justify="between"
      >
        <Box style={{transform: isMobile ? 'scale(0.8)' : ''}}>
          <PlayerCardLite />
        </Box>
        <Box style={{transform: isMobile ? 'scale(0.8)' : ''}}>
          <Description />
        </Box>
        <Box style={{transform: isMobile ? 'scale(0.8)' : ''}}>
          <PlayerCardLiteOwner />
        </Box>
      </Box>
    </Box>
  );
});
