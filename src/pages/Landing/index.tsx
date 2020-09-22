import * as React from 'react';
import {Box} from 'grommet';
import {useStores} from 'stores';
import {observer} from 'mobx-react-lite';
import {useCallback, useEffect} from 'react';
import * as styles from './landing-styles.styl';
import styled from 'styled-components';
import {Title, Text, Button} from 'components/Base';
import {Pricing} from './Pricing';
import CountdownTimer from 'react-component-countdown-timer';
import {SignIn} from '../../components/SignIn';
import moment from 'moment';
import {download} from '../../utils';
import {useMediaQuery} from 'react-responsive';
import {Head} from '../../components/Head';

const MainLogo = styled.img`
  width: auto;
  height: 100px;
  margin-left: -46px;
  z-index: 999;
`;

const b = moment();
const a = moment('20200901', 'YYYYMMDD');

const settings = {
  count: a.diff(b) / 1000,
  border: true,
  showTitle: true,
  noPoints: true,
};

export const Landing = observer(() => {
  const {routing, actionModals, user, tokenList} = useStores();

  const isMobile = useMediaQuery({query: '(max-width: 1000px)'});
  const isSmallMobile = useMediaQuery({query: '(max-width: 600px)'});

  useEffect(() => {
    // soccerPlayers.setMaxDisplay(20);
    // soccerPlayers.getList();
  }, []);

  const signIn = useCallback(() => {
    if (!user.isAuthorized) {
      actionModals.open(SignIn, {
        title: 'Sign in',
        applyText: 'Sign in',
        closeText: 'Cancel',
        noValidation: true,
        width: '500px',
        showOther: true,
        onApply: (data: any) => user.signIn(data.email, data.walletType),
      });
    } else {
      actionModals.open(
        () => (
          <Box pad="large">
            <Text>You are already authorised</Text>
          </Box>
        ),
        {
          title: 'Sign in',
          applyText: 'Go to buy',
          closeText: 'Cancel',
          noValidation: true,
          width: '500px',
          showOther: true,
          onApply: () => {
            routing.push('/buy');
            return Promise.resolve(true);
          },
        },
      );
    }
  }, []);

  return (
    <>
      <Head />
      <Box
        direction="column"
        justify="between"
        align="center"
        style={{overflow: 'hidden'}}
      >
        <Box className={styles.mainBlock}>
          <Box
            pad={{
              top: isSmallMobile ? '20px' : '60px',
              bottom: isSmallMobile ? '20px' : '50px',
            }}
            className={styles.pageContent}
          >
            {!isMobile ? (
              <>
                <img src="/landing/main/dragon.png" className={styles.dragon} />
                <img src="/landing/main/heroes.png" className={styles.heroes} />
                <img src="/landing/main/gold.png" className={styles.gold} />
              </>
            ) : null}

            <Box
              direction="column"
              align="start"
              justify="start"
              style={{height: '100%'}}
            >
              {/*<MainLogo src="main_logo.png" />*/}

              <Box
                direction="column"
                margin={{top: '40px'}}
                justify="around"
                style={{
                  maxWidth: isSmallMobile ? '100%' : 460,
                  height: isSmallMobile ? 'auto' : '100%',
                }}
              >
                <Title
                  style={{
                    textShadow: '3px 2px 10px #000000',
                    // textShadow:
                    //     '2px 0 0 #000, -2px 0 0 #000, 0 2px 0 #000, 0 -2px 0 #000, 1px 1px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
                    fontWeight: 600,
                    fontSize: isSmallMobile ? 30 : isMobile ? 35 : 45,
                    zIndex: 3,
                    // color: '#f9ca36',
                    // color: 'rgb(249 183 18)',
                    color: 'white',
                    textAlign: isSmallMobile ? 'center' : 'left',
                    letterSpacing: '0.02em',
                    display: isSmallMobile ? 'none' : 'block',
                    fontFamily:
                      'wfont_5de4af_58d65082edf1476c99721446ac4ddf3a,wf_58d65082edf1476c99721446a,orig_supercellmagic_regular',
                  }}
                  className={styles.mainTitle}
                  color="white"
                >
                  <span style={{color: '#f9ca36'}}>First Official <br /></span>
                  <span style={{color: '#f9ca36'}}>Chest Sale</span>
                </Title>

                <Box
                  direction="column"
                  pad="large"
                  gap="22px"
                  className={styles.specialBlock}
                >
                  <Text
                    // style={{ textShadow: '1px 4px 12px #000000' }}
                    color="white"
                    style={{
                      fontSize: '19px',
                      textShadow: '1px 4px 12px #000000',
                    }}
                  >
                    <b
                      style={{
                        textTransform: 'uppercase',
                        color: '#e7ab10',
                        margin: '15px 0px 15px 0',
                        textAlign: 'center',
                        display: !isSmallMobile ? 'none' : 'block',
                      }}
                    >
                      First Official Chest Sale
                    </b>

                    <b
                      style={{}}
                    >
                      Beast Quest, Animoca Brands and Harmony Protocol have teamed up
                      for this exclusive offer! Buy limited edition chests
                      containing gems, VIP points & NFT collectible cards.
                      Collect a set to win Harmony ONE tokens!
                    </b>
                    <b
                      style={{
                        textTransform: 'uppercase',
                        color: '#e7ab10',
                        margin: '15px 0 -5px 0',
                        textAlign: 'center',
                        display: isSmallMobile ? 'none' : 'block',
                      }}
                    >
                      This offer ends
                    </b>
                  </Text>
                  <CountdownTimer className={styles.timer} {...settings} />
                  <Button
                    style={{
                      width: '100%',
                      height: '70px',
                      alignItems: 'center',
                      fontWeight: 500,
                      fontSize: 30,
                      marginTop: 10,
                    }}
                    onClick={() => routing.push('/buy')}
                  >
                    Buy now
                  </Button>
                </Box>

                {/*{user.isAuthorized ? (*/}
                {/*  <Button*/}
                {/*    bgColor="rgb(0, 173, 232)"*/}
                {/*    size="xxlarge"*/}
                {/*    onClick={() => routing.push('/my-cards')}*/}
                {/*  >*/}
                {/*    My cards ({tokenList.list.length})*/}
                {/*  </Button>*/}
                {/*) : null}*/}
              </Box>

              <Box
                direction={isSmallMobile ? 'column' : 'row'}
                align="center"
                justify="end"
                style={{
                  position: isMobile ? 'relative' : 'absolute',
                  bottom: isMobile ? '-20px' : '40px',
                  right: isMobile ? '' : '-40px',
                }}
              >
                <a href="https://apps.apple.com/app/apple-store/id1419991954">
                  <img
                    src="/landing/main/app-store.png"
                    className={styles.appStore}
                  />
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.animocabrands.google.beastquest.towerdefense.td">
                  <img src="/landing/main/gp.png" className={styles.googlePlay} />
                </a>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className={styles.howToBuy}>
          <Box
            pad={{top: '120px', bottom: '50px', horizontal: 'large'}}
            className={styles.pageContent}
            direction="column"
            align="center"
            style={{maxWidth: 1350}}
          >
            <Title
              color="white"
              style={{
                fontWeight: 600,
                fontSize: 36,
                marginBottom: 20,
              }}
            >
              How to buy
            </Title>
            <Text color="white">
              First time buying digital goods? Follow the tutorial below to
              purchase these super valuable Beast Quest NFT chests!
            </Text>

            <Box
              pad={{vertical: '60px'}}
              className={styles.pageContent}
              direction="row"
              gap="20px"
              justify="center"
              style={{flexWrap: 'wrap'}}
            >
              <Box className={styles.reason}>
                <div className={styles.number}>1</div>
                <div className={styles.imageContainer}>
                  <img src="/landing/how-to-buy/1.png" />
                </div>
                <div className={styles.smallTitle}>
                  <Text>Create a digital wallet</Text>
                </div>
                <div className={styles.description}>
                  <Text>
                    Click the button below to create a wallet using your email
                  </Text>
                </div>
                <Button onClick={signIn}>Create wallet</Button>
              </Box>

              <Box className={styles.reason}>
                <div className={styles.number}>2</div>
                <div className={styles.imageContainer}>
                  <img src="/landing/how-to-buy/2.png" />
                </div>
                <div className={styles.smallTitle}>
                  <Text>Download Beast Quest</Text>
                </div>
                <div className={styles.description}>
                  <Text>
                    You need a Beast Quest User ID.
                    If you don't have one, download the game and follow step 3.
                  </Text>
                </div>
                <a href="https://www.animocabrands.com/beast-quest-ultimate-heroes?" target="_blank">
                  <Button btnType="href">Download now</Button>
                </a>
              </Box>

              <Box className={styles.reason}>
                <div className={styles.number}>3</div>
                <div className={styles.imageContainer}>
                  <img src="/landing/how-to-buy/3.png" />
                </div>
                <div className={styles.smallTitle}>
                  <Text>Get your Beast Quest User ID</Text>
                </div>
                <div className={styles.description}>
                  <Text>
                    After completing the tutorial in game, find your User ID in
                    Settings.
                  </Text>
                </div>
                <Button
                  onClick={() => {
                    actionModals.open(
                      () => (
                        <Box pad="medium">
                          <Title>
                            How to find your in-game user ID on Beast Quest
                            Ultimate Heroes
                          </Title>
                          <Box margin={{top: 'large'}}>
                            <Text>
                              <ul>
                                <li>
                                  You need to first finish the tutorial (first 3
                                  levels)
                                </li>
                                <li>
                                  Then you will be able to access to the main
                                  menu.
                                </li>
                                <li>
                                  Tap the setting button on the top right corner
                                  to open the setting menu
                                </li>
                                <li>
                                  You will find your user ID at the bottom right
                                  corner
                                </li>
                              </ul>
                            </Text>
                            <img src="/landing/how-to-buy/help.png" />
                          </Box>
                        </Box>
                      ),
                      {
                        title: 'How to find',
                        applyText: 'Got it',
                        closeText: '',
                        noValidation: true,
                        width: '700px',
                        showOther: true,
                        onApply: () => {
                          return Promise.resolve(true);
                        },
                      },
                    );
                  }}
                >
                  How to find
                </Button>
              </Box>

              <Box className={styles.reason}>
                <div className={styles.number}>4</div>
                <div className={styles.imageContainer}>
                  <img src="/landing/how-to-buy/4.png" />
                </div>
                <div className={styles.smallTitle}>
                  <Text>Top up</Text>
                </div>
                <div className={styles.description}>
                  <Text>
                    You will need to add ONE tokens to your digital wallet to
                    enjoy these special offers
                  </Text>
                </div>
                <Button
                  onClick={() => {
                    //window.location.href='https://docs.harmony.one/home/partners/ecosystem#exchanges'
                    window.open('https://docs.harmony.one/home/partners/ecosystem#exchanges', '_blank');
                    /*if (user.isAuthorized) {
                      routing.push('/buy');
                    } else {
                      signIn();
                    }*/
                  }}
                >
                  Top up
                </Button>
              </Box>

              <Box className={styles.reason}>
                <div className={styles.number}>5</div>
                <div className={styles.imageContainer}>
                  <img src="/landing/how-to-buy/5.png" />
                </div>
                <div className={styles.smallTitle}>
                  <Text>Purchase chests</Text>
                </div>
                <div className={styles.description}>
                  <Text>
                    Once you have purchased a chest, your Collectible Card
                    will be appear in your digital wallet.
                  </Text>
                </div>
                <Button onClick={() => routing.push('/buy')}>Buy now</Button>
              </Box>
            </Box>
          </Box>
        </Box>


        <Box className={styles.needToBuy}>
          <Box
            pad={{top: '60px', bottom: '0px'}}
            direction="row"
            align="center"
          >
            <iframe width="560" height="315" src="https://www.youtube.com/embed/uPPj1yzzAKA" frameBorder="0"
                    style={{margin: 'auto'}}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen></iframe>
          </Box>
          <Box
            pad={{top: '60px', bottom: '100px'}}
            className={styles.pageContent}
            direction="row"
            align="center"
          >

            <Box>
              <Title color="white">
                How do the staking rewards work?
              </Title>
            </Box>
            <Box>
              <Text color="white">
                You have a chance to win a Harmony ONE staking reward
                worth 10,000 ONE tokens! To be eligible for the Harmony ONE
                staking reward, you need to collect a set of cards
                and delegate 50,000 ONE tokens to Animoca’s
                Harmony validator. A set can be any of the following:
                20 common cards, 10 rare, 5 epic, or 1 legendary card.

                For more information on the ONE staking reward, please see this blog post.
              </Text>
            </Box>
          </Box>
        </Box>

        <Box className={styles.pricing}>
          <Box
            pad={{
              top: isSmallMobile ? '50px' : '80px',
              bottom: isSmallMobile ? '50px' : '80px',
            }}
            // className={styles.pageContent}
            direction="column"
            align="center"
            fill={true}
            style={{maxWidth: 1200, margin: '0 auto'}}
          >
            <Title
              style={{
                fontWeight: 600,
                fontSize: 36,
                marginBottom: 20,
              }}
              color="white"
            >
              Pricing
            </Title>
            <Pricing />
          </Box>
        </Box>
      </Box>
    </>
  );
});
