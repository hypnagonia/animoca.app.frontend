import * as React from 'react';
import {Box} from 'grommet';
// import { Facebook } from 'grommet-icons';

export const Footer = props => (
  <Box
    flex={{shrink: 0}}
    style={{backgroundColor: props.bg}}
    direction="row"
    justify="center"
    pad={{horizontal: 'xlarge', vertical: 'large'}}
    {...props}
  >
    <a href='https://harmony.one/' target='_blank'>
      <img  src='/social/harmony-white.png' style={{width: 36, height: 36, marginRight: 30}}/>
    </a>

    <a href='https://harmony.one/twitter' target='_blank'>
      <img src='/social/twitter-white.png' style={{width: 36, height: 36, marginRight: 30}}/>
    </a>

    <a href='https://harmony.one/youtube' target='_blank'>
      <img src='/social/youtube-white.png' style={{width: 36, height: 36, marginRight: 30}}/>
    </a>
    <a href='https://harmony.one/atari-telegram' target='_blank'>
      <img src='/social/telegram-white.png' style={{width: 36, height: 36, marginRight: 30}}/>
    </a>

    <a href='https://harmony.one/discord' target='_blank'>
      <img src='/social/discord-white.png' style={{width: 36, height: 36}}/>
    </a>

  </Box>
);
