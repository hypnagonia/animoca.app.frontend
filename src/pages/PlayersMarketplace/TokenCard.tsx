import * as React from 'react';
import { Box } from 'grommet';
import { Icon, Text } from 'components/Base';
import { observer } from 'mobx-react-lite';
import * as styles from './card.styl';
import handleViewport from 'react-in-viewport';

import { useStores } from 'stores';
import { ITokenCard } from 'stores/TokenList';
import { Html, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "react-three-fiber";
import * as THREE from "three";

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
  data?: ITokenCard;
  forwardedRef?: any;
  style?: any;
}

export const PlayerCardEx = observer<IPlayerCardProps>(props => {
  const { user } = useStores();

  // const bech32Owner = props.player ? getBech32Address(props.player.owner) : '';
  return (
    <Box
      className={styles.cardContainer}
      height="100%"
      align="center"
      background=""
      ref={props.forwardedRef}
      style={props.style}
    >
      {/*<img width="100%" src={props.data.image} />*/}

      <DracoLocalScene />

      <Box className={styles.infoBlock} fill={true} gap="10px" pad="medium">
        <span>
          Centipede 2600 Cartridge Classic - RED
        </span>
        {/*<DataItem icon="Right" iconSize="16px" text={props.data.playerId || '—'} label="Player ID" />*/}
        {/*<DataItem icon="User" iconSize="16px" text={"Centipede 2600 Cartridge Classic - RED"} label="Name" />*/}
       {/* <DataItem
          icon="Medal"
          iconSize="16px"
          text={
            props.data.attributes.find(v => v.trait_type === 'rarity').value
          }
          label="Rarity"
        />*/}
        {/*{props.data.attributes.map(item => (*/}
        {/*  <DataItem*/}
        {/*    text={item.value}*/}
        {/*    label={item.trait_type}*/}
        {/*    icon={''}*/}
        {/*    iconSize={'0px'}*/}
        {/*  />*/}
        {/*))}*/}
      </Box>

      {/*<DisableWrap disabled={!props.player}>*/}
      {/*  {user.address === bech32Owner ? (*/}
      {/*    <Box*/}
      {/*      className={styles.buyButtonMy}*/}
      {/*      fill={true}*/}
      {/*      direction="row"*/}
      {/*      justify="center"*/}
      {/*    >*/}
      {/*      <Text color="white" size={'medium'}>*/}
      {/*        It is your card*/}
      {/*      </Text>*/}
      {/*      <Box onClick={buyPlayerHandler}>*/}
      {/*        <Icon*/}
      {/*          glyph="Send"*/}
      {/*          size="20px"*/}
      {/*          color={'white'}*/}
      {/*          style={{ marginLeft: 10, width: 25 }}*/}
      {/*        />*/}
      {/*      </Box>*/}
      {/*    </Box>*/}
      {/*  ) : (*/}
      {/*    <Box*/}
      {/*      className={styles.buyButton}*/}
      {/*      fill={true}*/}
      {/*      onClick={buyPlayerHandler}*/}
      {/*    >*/}
      {/*      <Text color="white" size={'medium'}>*/}
      {/*        Buy this card*/}
      {/*      </Text>*/}
      {/*    </Box>*/}
      {/*  )}*/}
      {/*</DisableWrap>*/}
    </Box>
  );
});


function SuzanneWithLocal() {
  useGLTF.preload("/cartridge.glb")

  const { nodes, materials } = useGLTF("/cartridge.glb");
  console.log({ nodes, materials }, nodes['Red']);

  return (
    <primitive object={nodes['Red']}/>
  )
}

function DracoLocalScene() {
  return (
    <Canvas
      colorManagement
      shadowMap
      camera={{ position: new THREE.Vector3(0, 0, 61), fov: 84 }}
      /*pixelRatio={window.devicePixelRatio}*/
      style={{height: 360}}
    >
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <directionalLight position={[-10, -10, -5]} intensity={1} />
      {/*
          <ambientLight intensity={0.8} />
          <pointLight intensity={1} position={[0, 6, 0]} />*/}
      <React.Suspense fallback={<Html>Loading</Html>}>
        <SuzanneWithLocal />
      </React.Suspense>
      {/*@ts-ignore*/}
      <OrbitControls />
    </Canvas>
  );
}

export const TokenCard = handleViewport(PlayerCardEx);
