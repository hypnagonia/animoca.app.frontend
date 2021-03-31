import * as React from 'react';
import styled, { withTheme } from 'styled-components';
import { BoxProps, Box } from 'grommet';
import { useHistory } from 'react-router';
import { observer } from 'mobx-react-lite';
import { Routes } from 'constants/routes';
import { Text } from 'grommet';
import { IStyledChildrenProps } from 'interfaces';
import { Icon } from '../Base/components/Icons';
import { useStores } from '../../stores';
import { Button } from '../Base/components/Button';
import {
  formatWithTwoDecimals,
  ones,
  truncateAddressString,
} from '../../utils';
import { SignIn } from '../SignIn';
import { Spinner } from '../../ui/Spinner';
import { useMediaQuery } from 'react-responsive';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState } from 'react';
import * as styles from './styles.styl';
import cn from 'classnames';
import { MobileMenu } from './MobileMenu';

export const MainLogo = styled.img`
  width: auto;
  height: 62px;
  color: black;
`;

export const MainLogoSmall = styled.img`
  width: auto;
  height: 52px;
`;

export const Head: React.FC<IStyledChildrenProps<BoxProps>> = withTheme(
  observer(({ theme }: IStyledChildrenProps<BoxProps>) => {
    const history = useHistory();
    const [isCopy, setIsCopy] = useState(false);
    const { user, actionModals, tokenList } = useStores();
    const { palette, container } = theme;
    const { minWidth, maxWidth } = container;

    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1000px)' });
    const isSmallMobile = useMediaQuery({ query: '(max-width: 800px)' });

    if (isSmallMobile) {
      return (
        <Box
          style={{
            // background: palette.StandardWhite,
            background: '#f6f7fb',
            overflow: 'visible',
            position: 'absolute',
            top: 0,
            width: '100%',
            zIndex: 100,
            boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Box
            direction="row"
            align="center"
            justify="between"
            style={{
              minWidth,
              maxWidth,
              margin: '0 auto',
              padding: '0px 20px 0 5px',
              height: 100,
              minHeight: 100,
              width: '100%',
            }}
          >
            <Box direction="row" align="center">
              <Box
                align="center"
                margin={{ right: 'small' }}
                onClick={() => history.push('/')}
              >
                <MainLogoSmall src="atari-logo.png" />
              </Box>
              <Box>
                {/*<Title size="small" color="BlackTxt" bold>*/}
                {/*  Harmony Soccer Players*/}
                {/*</Title>*/}
              </Box>
            </Box>

            {user.status !== 'success' ? (
              <Spinner />
            ) : user.isAuthorized ? (
              <Button
                style={{ width: 140 }}
                onClick={() => {
                  actionModals.open(MobileMenu, {
                    title: 'Menu',
                    applyText: 'Close Menu',
                    closeText: '',
                    noValidation: true,
                    width: '500px',
                    showOther: true,
                    onApply: (data: any) => Promise.resolve(true),
                  });
                }}
              >
                Menu
              </Button>
            ) : (
              <Button
                style={{ width: 140 }}
                onClick={() => {
                  actionModals.open(SignIn, {
                    title: 'Sign in',
                    applyText: 'Sign in',
                    closeText: 'Cancel',
                    noValidation: true,
                    width: '500px',
                    showOther: true,
                    onApply: (data: any) =>
                      user.signIn(data.email, data.walletType),
                  });
                }}
              >
                Sign in
              </Button>
            )}
          </Box>
        </Box>
      );
    }

    return (
      <Box
        style={{
          // background: palette.StandardWhite,
          background: '#f6f7fb',
          overflow: 'visible',
          position: 'absolute',
          top: 0,
          width: '100%',
          zIndex: 100,
          boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Box
          direction="row"
          align="center"
          justify="between"
          style={{
            minWidth,
            maxWidth,
            margin: '0 auto',
            padding: '0px 30px',
            height: 100,
            minHeight: 100,
            width: '100%',
          }}
        >
          <Box direction="row" align="center">
            <Box
              align="center"
              direction="row"
              margin={{ right: 'small' }}
              onClick={() => history.push('/')}
            >
              <MainLogoSmall src="atari-logo.png" style={{marginRight: 20}}/>
              <MainLogoSmall src="qlogo.png" style={{marginRight: 8}}/>
              <MainLogoSmall src="harmony-logo-word.png"/>
            </Box>
            <Box>
              {/*<Title size="small" color="BlackTxt" bold>*/}
              {/*  Harmony Soccer Players*/}
              {/*</Title>*/}
            </Box>
          </Box>


          <Box direction="row" align="center" gap="30px">
            {/*<Box style={{ flex: '1 1 100%' }} />*/}


            <Button
              style={{ width: isTabletOrMobile ? 80 : 140 }}
              onClick={() => history.push('/buy')}
            >
              Buy
            </Button>


            {user.status !== 'success' ? null : (
              <Button
                onClick={() => history.push('/my-cards')}
                disabled={!user.isAuthorized}
                style={{ width: isTabletOrMobile ? 130 : 140 }}
              >
                Inventory {tokenList.list.length && user.address ? `(${tokenList.list.length})` : ''}
              </Button>
            )}

       {/*     <Button
              onClick={() => history.push('/leaders')}
              style={{ width: isTabletOrMobile ? 130 : 140 }}
            >
              Leaders
            </Button>*/}

            {user.status !== 'success' ? (
              <Spinner />
            ) : user.isAuthorized ? (
              <Box direction="row" justify="end" align="center">
                <Box dir="column">
                  <Text color="rgb(164, 168, 171)" size="small">
                    You authorised as: {user.email}
                  </Text>
                  <Box direction="row" align="center">
                    {truncateAddressString(user.address, 6)}
                    <CopyToClipboard
                      text={user.address}
                      onCopy={() => {
                        setIsCopy(true);
                        setTimeout(() => setIsCopy(false), 3000);
                      }}
                    >
                      <div
                        className={cn(
                          styles.copyButton,
                          isCopy ? styles.copied : '',
                        )}
                      >
                        {isCopy ? 'Address Copied' : 'Copy Address'}
                      </div>
                    </CopyToClipboard>
                  </Box>
                  <Text size="small">
                    Balance: {formatWithTwoDecimals(ones(user.balance))} ONEs
                  </Text>
                </Box>
                <Box
                  onClick={() => {
                    user.signOut().then(() => {
                      history.push(`/${Routes.login}`);
                    });
                  }}
                  margin={{ left: 'medium' }}
                >
                  <Icon
                    glyph="Logout"
                    size="24px"
                    style={{ opacity: 0.5 }}
                    color="BlackTxt"
                  />
                </Box>
              </Box>
            ) : (
              <Box
                direction="row"
                justify="end"
                align="center"
                style={{ marginRight: 2, marginTop: 2 }}
              >
                <Button
                  style={{ width: 120 }}
                  onClick={() => {
                    actionModals.open(SignIn, {
                      title: 'Sign in',
                      applyText: 'Sign in',
                      closeText: 'Cancel',
                      noValidation: true,
                      width: '500px',
                      showOther: true,
                      onApply: (data: any) =>
                        user.signIn(data.email, data.walletType),
                    });
                  }}
                >
                  Sign in
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    );
  }),
);
