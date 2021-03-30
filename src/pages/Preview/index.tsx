import * as React from 'react';
import {observer} from 'mobx-react-lite';
import {useStores} from '../../stores';
import {useEffect} from 'react';
import {Box} from 'grommet';
import {Title} from '../../components/Base/components/Title';
import {TokenCard} from '../PlayersMarketplace/TokenCard';
import {share} from '../../utils/twitterShare'
import {Button} from '../../components/Base/components/Button';
import {MobileMenu} from '../../components/Head/MobileMenu';
import {Icon} from '../../components/Base/components/Icons';
import { Twitter } from 'grommet-icons';

export const Preview = observer(() => {
  const {actionModals, routing, tokenList} = useStores();

  useEffect(() => {
    if (tokenList.hasNewCards) {
      let scale = 'scale(0.8)',
        width = '1000px';

      console.log({new: tokenList.newCardsList.length})

      if (tokenList.newCardsList.length === 1) {
        width = '600px';
        scale = 'scale(1)';
      }

      if (tokenList.newCardsList.length > 3) {
        width = '1100px';
        scale = 'scale(0.7)';
      }

      actionModals.open(
        () => (
          <Box pad={{vertical: 'large', horizontal: 'small'}}>
            <Title style={{textAlign: 'center'}}>
              You got {tokenList.newCardsList.length} new{' '}
              {tokenList.newCardsList.length === 1 ? 'card' : 'cards'}!
            </Title>
            <Box
              direction="row"
              justify="center"
              align="start"
              wrap
              gap={tokenList.newCardsList.length < 10 ? '20px' : '10x'}
              style={{
                minHeight: 300,
                height: 'auto',
                // transform: 'scale(0.9)',
              }}
              margin={{top: 'large'}}
            >
              {tokenList.newCardsList.map((item, idx) => (
                <TokenCard
                  style={{transform: scale, marginBottom: '5px'}}
                  key={item.id}
                  data={item}
                />
              ))}
            </Box>

            <Box
              direction="row"
              justify="center"
            >
              Congratulations on completing your purchase!
              Share this on social media!
            </Box>
            <Box
              style={{marginTop: 20}}
              direction="row"
              justify="center"
            >

              <Button
                style={{ width: 140 }}
                onClick={() => share({
                  text: `I just bought ${tokenList.newCardsList.length || ''} @atari @quidd NFT "Centipede 2600 Cartridge" on @harmonyprotocol! Join in for your chance to own a piece of history 🎉🥳👇`,
                  hashtags: 'HarmonyNFTs'
                })}
              >
                <Twitter size="small" color={'white'} />&nbsp;
                Tweet
              </Button>
            </Box>
          </Box>
        ),
        {
          title: 'Sign in',
          applyText: 'Show all my cards',
          closeText: 'Cancel',
          noValidation: true,
          width,
          showOther: true,
          onApply: () => {
            routing.push('/my-cards');
            return Promise.resolve();
          },
          onClose: () => {
            tokenList.clearNewCards();
          },
        },
      );
    }
  }, [tokenList.hasNewCards]);

  return <></>;
});
