import * as React from "react";
import { Box } from "grommet";
import { Title, Text, Button } from "components/Base";
import * as styles from "./pricing-styles.styl";
import cn from "classnames";
import {
  Form,
  Input,
  isRequired,
  MobxForm,
  NumberInput
} from "components/Form";
import { inject, observer } from "mobx-react";
import { formatWithTwoDecimals, moreThanZero, lessOrOne } from "utils";
import { IStores, useStores } from "../../stores";
import { BuyLootBoxModal } from "../PlayersMarketplace/BuyLootBoxModal";
import { SignIn } from "../../components/SignIn";
import { useMediaQuery } from "react-responsive";
import { withRouter } from "react-router";

import { Suspense } from "react";
import { Canvas, useLoader } from "react-three-fiber";
// @ts-ignore
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { Mesh, Vector3 } from "three";
import * as THREE from "three";

import { useGLTF, OrbitControls, Html , useFBX} from "@react-three/drei";

export const BoxItem = (props: {
  id: string;
  selected: boolean;
  onClick: () => void;
  total: number;
  allow: number;
}) => {
  return (
    <Box
      pad="medium"
      className={cn(styles.boxItem, props.selected ? styles.selected : "")}
      onClick={() => props.onClick()}
    >
      <img style={{ width: 156, height: 131 }} src={`/Flea.png`} />
      <div className={styles.numbers}>
        <Text color="white">
          {props.allow}/{props.total}
        </Text>
      </div>
    </Box>
  );
};

const DataItem = (props: { text: any; label: string }) => {
  return (
    <Box direction="row" justify="between" gap="10px">
      <Box direction="row" justify="start" align="center" gap="5px">
        <Text size="medium" color="white">
          {props.label}
        </Text>
      </Box>
      <Text color="white" size="medium" bold={true}>
        {props.text}
      </Text>
    </Box>
  );
};

const DataItemLarge = (props: { text: any; label: string }) => {
  return (
    <Box direction="row" justify="between" gap="10px">
      <Box direction="row" justify="start" align="center" gap="5px">
        <Title color="white">{props.label}</Title>
      </Box>
      <Title color="white" bold={true}>
        {props.text}
      </Title>
    </Box>
  );
};

const Preview = ({ buyBtn = null }) => {
  const isSmallMobile = useMediaQuery({ query: "(max-width: 600px)" });
  const { tokenList } = useStores();

  return (
    <Box
      direction="column"
      width="400px"
      gap="20px"
      style={{ background: "#0D1C2B", borderRadius: 12, flexGrow: 1 }}
      pad={isSmallMobile ? "20px" : "xlarge"}
      margin={{ top: isSmallMobile ? "" : "medium", right: "medium" }}
    >
      <Title color="white">Limited Edition</Title>
      <Text color="white">
        {/* Each chest costs 1000 ONE and contains 2400 gems,
        730 VIP points and a random NFT collectible card
        with rarity Common, Rare, Epic or Legendary.
        If you collect a set of cards, you are
        eligible for a 10,000 ONE staking reward!*/}
        Get your hands on ONE of only 100 NFTs.
        The Centipede series, created by the legendary Dona Bailey,
        carry a special spirit and set the industry standard for decades.
        Own ONE piece of history today.
      </Text>

      <Box direction="row">
      {/*  <Box direction="column" style={{ minWidth: 132, maxWidth: 132, maxHeight: 140 }}>
          {tokenList.boxes.map(box => (
            <BoxItem
              key={box.id}
              {...box}
              selected={box.id === tokenList.boxId}
              onClick={() => (tokenList.boxId = box.id)}
            />
          ))}
        </Box>*/}
        {!isSmallMobile ? (
          <Box justify="center" align="center"
               style={{ width: "100%" }}>
            {/* <img
              style={{maxWidth: '100%'}}
              src={`/landing/pricing/preview.png`}
            />*/}
            {/*<img
              style={{maxWidth: '100%'}}
              src="/bquh-chest01.png" />*/}

            <DracoLocalScene />
          </Box>
        ) : null}
      </Box>


     {/* <Box >
        <Title color="white">Download Beast Quest</Title>
        <img style={{ width: 200, marginTop: 20 }} src="/BQQR.png" />
      </Box>*/}

      <Box justify="center" align="center">
        {buyBtn}
      </Box>
    </Box>
  );
};

@inject("user", "actionModals", "buyPlayer", "soccerPlayers", "tokenList")
@observer
export class PricingBase extends React.Component<IStores> {
  formRef: MobxForm;

  buyHandler = async () => {
    const { user, actionModals, tokenList } = this.props;

    if (!user.isAuthorized) {
      await actionModals.open(SignIn, {
        title: "Sign in",
        applyText: "Sign in",
        closeText: "Cancel",
        noValidation: true,
        width: "500px",
        showOther: true,
        onApply: (data: any) => user.signIn(data.email, data.walletType)
      });
    }

    this.formRef.validateFields().then(async data => {
      if (!user.isAuthorized) {
        await actionModals.open(SignIn, {
          title: "Sign in",
          applyText: "Sign in",
          closeText: "Cancel",
          noValidation: true,
          width: "500px",
          showOther: true,
          onApply: (data: any) => user.signIn(data.email, data.walletType)
        });
      }

      // await buyPlayer.initPlayer(soccerPlayers.list[0].player);

      actionModals.open(() => <BuyLootBoxModal />, {
        title: "",
        applyText: "Buy Now",
        closeText: "Cancel",
        noValidation: true,
        width: "1000px",
        showOther: true,
        onApply: () => this.props.tokenList.buyLootBox(),
        onClose: () => tokenList.clear()
      });
    });
  };


  render() {
    // @ts-ignore
    const { tokenList, user, actionModals, history, location } = this.props;

    const isLandingPage = location.pathname === "/";

    const buyBtn = <Button
      disabled={user.status !== "success"}
      size="xlarge"
      style={{
        fontSize: 40,
        padding: 30,
        marginTop: 20,
        cursor: "pointer"
      }}
      onClick={() => {
        if (isLandingPage) {
          history.push("/buy");
          return;
        }

        this.buyHandler();
      }}
    >
      Buy now
    </Button>;

    return (
      <Box
        className={styles.pricingBody}
        margin={{ top: "medium" }}
        gap="20px"
        justify="between"
        fill={true}
      >
        <Preview buyBtn={isLandingPage ? buyBtn : null} />


        {!isLandingPage && <Box
            direction="column"
            width="400px"
            justify="center"
            style={{ background: "#0D1C2B", borderRadius: 12, height: 400, marginTop: 24 }}
        >
          <Form
              ref={ref => (this.formRef = ref)}
              data={tokenList.formData}
              {...({} as any)}
          >
            <Box
                direction="column"
                justify="between"
                align="center"
                pad="20px"
                className={styles.formStyles}
            >
              <Box direction="row" align="end">
                <Input
                    name="address"
                    disabled={true}
                    label={
                      user.isAuthorized
                        ? "Wallet Address"
                        : "Wallet Address (sign in to get wallet address)"
                    }
                    style={{
                      width: !user.isAuthorized ? "260px" : "361px",
                      maxWidth: "100%"
                    }}
                    placeholder="address"
                    rules={[isRequired]}
                />
                {!user.isAuthorized ? (
                  <Button
                    margin={{ left: "medium", bottom: "small" }}
                    onClick={() => {
                      actionModals.open(SignIn, {
                        title: "Sign in",
                        applyText: "Sign in",
                        closeText: "Cancel",
                        noValidation: true,
                        width: "500px",
                        showOther: true,
                        onApply: (data: any) =>
                          user.signIn(data.email, data.walletType)
                      });
                    }}
                    disabled={user.status !== "success"}
                  >
                    Sign in
                  </Button>
                ) : null}
              </Box>
              {/* <Box
                direction="column"
                justify="start"
                align="start"
                style={{width: '361px'}}
                margin={{top: 'small', bottom: 'medium'}}
              >
                <Text color="white">Platform</Text>
                <Box direction="row">
                  <Box
                    className={cn(
                      styles.platformButton,
                      tokenList.formData.platform === 'ios'
                        ? ''
                        : styles.selected,
                    )}
                    onClick={() => (tokenList.formData.platform = 'ios')}
                  >
                    IOS
                  </Box>
                  <Box
                    className={cn(
                      styles.platformButton,
                      tokenList.formData.platform === 'android'
                        ? ''
                        : styles.selected,
                    )}
                    onClick={() => (tokenList.formData.platform = 'android')}
                  >
                    Android
                  </Box>
                </Box>
              </Box>*/}
              {/* <Input
                name="playerId"
                label="Beast Quest Player ID"
                style={{width: '361px', maxWidth: '100%'}}
                placeholder="player id"
                rules={[isRequired]}
              />*/}
              <NumberInput
                  name="amount"
                  label="Amount"
                  disabled
                  style={{ width: "361px", maxWidth: "100%" }}
                  placeholder="0"
                  rules={[isRequired, moreThanZero, lessOrOne]}
              />
              <Box direction="column" gap="30px" margin={{ top: "10px" }}>
                <Box direction="column" gap="10px">
                  {/*  <DataItem
                    label="Lootbox type:"
                    text={`${tokenList.selectedBox.id}`}
                  />*/}
                  <DataItem
                      label="Price:"
                      text={`${tokenList.selectedBox.price} ONEs`}
                  />
                  <Box margin={{ top: "small" }}>
                    <DataItemLarge
                        label="Total:"
                        text={`${formatWithTwoDecimals(tokenList.total)} ONEs`}
                    />
                  </Box>
                </Box>
                <Box style={{ width: "361px", maxWidth: "100%" }}>
                  <Button
                      disabled={user.status !== "success"
                      || tokenList.list.length && tokenList.list.length > 1}
                      size="xlarge"
                      onClick={() => {
                        this.buyHandler();
                      }}
                  >
                    Buy now
                  </Button>
                </Box>
              </Box>
            </Box>
          </Form>
        </Box>}
      </Box>
    );
  }
}




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
          camera={{ position: new THREE.Vector3(0, 0, 61), fov: 75 }}
          /*pixelRatio={window.devicePixelRatio}*/
          style={{height: 500}}
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
          <OrbitControls   enableZoom={false} />
        </Canvas>
  );
}


// @ts-ignore
export const Pricing = withRouter(PricingBase);
