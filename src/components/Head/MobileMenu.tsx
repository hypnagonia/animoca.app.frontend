import { Box, Text } from 'grommet';
import { Button } from '../Base/components/Button';
import {
  formatWithTwoDecimals,
  ones,
  truncateAddressString,
} from '../../utils';
import { Routes } from '../../constants';
import * as React from 'react';
import { useStores } from '../../stores';
import { useHistory } from 'react-router';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState } from 'react';
import * as styles from './styles.styl';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';

export const MobileMenu = observer(props => {
  const history = useHistory();
  const { user, tokenList, actionModals } = useStores();
  const [isCopy, setIsCopy] = useState(false);

  return (
    <Box
      direction="column"
      pad="large"
      gap="30px"
      margin={{ vertical: '30px' }}
      justify="center"
      align="center"
    >
      {user.isAuthorized ? (
        <Box dir="column" gap="10px" align="center">
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
                className={cn(styles.copyButton, isCopy ? styles.copied : '')}
              >
                {isCopy ? 'Address Copied' : 'Copy Address'}
              </div>
            </CopyToClipboard>
          </Box>
          <Text size="small">
            Balance: {formatWithTwoDecimals(ones(user.balance))} ONEs
          </Text>
        </Box>
      ) : null}

      <Button
        style={{ width: 200 }}
        disabled
        onClick={() => {
          //history.push('/buy');
          actionModals.closeLastModal();
        }}
      >
        Buy
      </Button>

      {user.status !== 'success' ? null : (
        <Button
          onClick={() => {
            history.push('/my-cards');
            actionModals.closeLastModal();
          }}
          disabled={!user.isAuthorized}
          style={{ width: 200 }}
        >
          Inventory {tokenList.list.length ? `(${tokenList.list.length})` : ''}
        </Button>
      )}

    {/*  <Button
        onClick={() => {
          history.push('/leaders')
          actionModals.closeLastModal();
        }}
        style={{ width: 200 }}
      >
        Leaders
      </Button>*/}

      <Button
        onClick={() => {
          actionModals.closeLastModal();
          user.signOut().then(() => {
            history.push(`/${Routes.login}`);
          });
        }}
        style={{ width: 200 }}
      >
        Sign out
      </Button>
    </Box>
  );
});
