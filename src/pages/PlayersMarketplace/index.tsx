import * as React from "react";
import { Box } from "grommet";
import { Loader, Button } from "components/Base";
import { BaseContainer, PageContainer } from "components";
import { TokenCard } from "./TokenCard";
import { useStores } from "stores";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { SignIn } from "../../components/SignIn";
import { PlayerIDModal } from "../../components/PlayerIDModal";
import { PlayerIDModalAll } from "../../components/PlayerIDModalAll";
import { ClaimTransactionModal } from "../../components/ClaimTransactionModal";

import { useMediaQuery } from "react-responsive";
// import { PLAYERS_FILTER } from '../../stores/SoccerPlayersList';

export const PlayersMarketplace = observer(() => {
  const { tokenList, user, actionModals, routing } = useStores();

  const [isPlayerIDModalOpen, setPlayerIDModal] = React.useState(false);
  const [isPlayerIDModalAllOpen, setPlayerIDModalAll] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [claimTxDetails, setClaimTxDetails]= React.useState(null);

  useEffect(() => {
    // soccerPlayers.setMaxDisplay(20);
    if (!user.isAuthorized && user.status === "success") {
      actionModals.open(SignIn, {
        title: "Sign in",
        applyText: "Sign in",
        closeText: "Cancel",
        noValidation: true,
        width: "500px",
        showOther: true,
        onApply: (data: any) => user.signIn(data.email, data.walletType),
        onClose: () => {
          if (!user.isAuthorized) {
            routing.push("/");
          }
        }
      });
    } else {
      if (tokenList.list.length === 0) {
        tokenList.getList();
      }
    }
  }, [user.status]);



  useEffect(() => {
    if (!isPlayerIDModalOpen) {
      return;
    }
    // soccerPlayers.setMaxDisplay(20);
    actionModals.open(PlayerIDModal, {
      title: "Claim",
      applyText: "Claim",
      closeText: "Cancel",
      noValidation: true,
      width: "500px",
      showOther: false,
      //@ts-ignore
      onApply: async (data: any) => {
        actionModals.closeLastModal();
        setPlayerIDModal(false);
        if (data === null) {
          return
        }

        setIsLoading(true);
        await tokenList.getList();
        setIsLoading(false);

      },
      onClose: () => {
        setPlayerIDModal(false);
      }
    });
  }, [isPlayerIDModalOpen]);

  useEffect(() => {
    if (!isPlayerIDModalAllOpen) {
      return;
    }
    // soccerPlayers.setMaxDisplay(20);
    actionModals.open(PlayerIDModalAll, {
      title: "Claim",
      applyText: "Claim",
      closeText: "Cancel",
      noValidation: true,
      width: "500px",
      showOther: false,
      //@ts-ignore
      onApply: async (data: any) => {
        actionModals.closeLastModal();
        setPlayerIDModalAll(false);
        if (data === null) {
          return
        }

        setIsLoading(true);
        await tokenList.getList();
        setIsLoading(false);

      },
      onClose: () => {
        setPlayerIDModalAll(false);
      }
    });
  }, [isPlayerIDModalAllOpen]);

  const isSmallMobile = useMediaQuery({ query: "(max-width: 600px)" });
  console.log("sets", Object.keys(tokenList.list).length);
  return (
    <BaseContainer>
      <Box style={
        {
          display: 'none',
          backgroundColor: "white",
          borderRadius: "5px",
          padding: "20px",
          margin: "0 auto",
          width: "450px",
          marginBottom: "40px"
        }
      }>
        <Box
          direction="row"
          align="center"
          justify="center"
          style={{ color: "black", fontWeight: "bold" }}
        >
          {tokenList.totalSets > -1 && <div>
            Sets:&nbsp;{tokenList.totalSets}
          </div>}
        </Box>
        <Box
          direction="row"
          align="center"
          justify="center"
          style={{
            color: "black", fontWeight: "bold", textTransform: "capitalize"
          }}>

          {Object.keys(tokenList.totalByRarity).map(k => <div key={k} style={{ marginRight: 20 }}>
            {k}:&nbsp;{tokenList.totalByRarity[k]}
          </div>)}
        </Box>
        <Box
          direction="row"
          align="center"
          justify="center"
          style={{
            color: "black", fontWeight: "bold", textTransform: "capitalize"
          }}>
          <div style={{ marginRight: 20 }}>Gems: {tokenList.list.length * 2400}</div>
          <div>VIP Points: {tokenList.list.length * 730}</div>
        </Box>


        <Box direction="row" align="center" gap="30px" style={{ margin: "auto", marginTop: 20 }}>
          <a
            href="https://staking.harmony.one/validators/mainnet/one1xrlz4kjut6rpq4ghvernnjgxwcrq27kwqresgc"
            target="_blank"
            title="After having one Set, delegate at least 50,000 ONE to Animoca validator to earn additional rewards"
          ><Button btnType="href">Stake</Button>
          </a>

          {tokenList.canClaim && <Button onClick={() => setPlayerIDModal(true)}>Claim In-Game Currency</Button>}
          {tokenList.canClaimAll && <Button onClick={() => setPlayerIDModalAll(true)}>Change Player ID</Button>}
        </Box>

      </Box>


      <PageContainer>
        {/*<Box*/}
        {/*  direction="row"*/}
        {/*  justify="end"*/}
        {/*  align="center"*/}
        {/*  margin={{ vertical: '30px' }}*/}
        {/*>*/}
        {/*  <Box gap="20px" direction="row" align="end">*/}
        {/*    <Title*/}
        {/*      size="small"*/}
        {/*      color="white"*/}
        {/*      style={{*/}
        {/*        boxShadow: 'box-shadow: 0 0 20px rgba(0,0,0,0.4)',*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      sort by*/}
        {/*    </Title>*/}
        {/*    <Select*/}
        {/*      size="medium"*/}
        {/*      onChange={soccerPlayers.setSort}*/}
        {/*      value={soccerPlayers.sort}*/}
        {/*      options={[*/}
        {/*        {*/}
        {/*          text: 'high price',*/}
        {/*          value: 'highPrice',*/}
        {/*        },*/}
        {/*        {*/}
        {/*          text: 'low price',*/}
        {/*          value: 'lowPrice',*/}
        {/*        },*/}
        {/*        {*/}
        {/*          text: 'card number',*/}
        {/*          value: 'internalPlayerId',*/}
        {/*        },*/}
        {/*      ]}*/}
        {/*    />*/}
        {/*  </Box>*/}
        {/*</Box>*/}

        {isLoading ?
          //@ts-ignore
          <Loader />
          : tokenList.status === "first_fetching" ? (
          <Loader />
        ) : (
          <Box
            direction="row"
            justify={
              tokenList.filteredList.length < 10 || isSmallMobile
                ? "start"
                : "start"
            }
            align="start"
            wrap
            gap={tokenList.filteredList.length < 10 ? "20px" : "10x"}
            style={{ minHeight: 600 }}
          >

            {tokenList.filteredList.map((item, idx) => (
              <TokenCard
                key={item.id}
                data={item}
                // onEnterViewport={() => {
                //   if (idx + 10 > soccerPlayers.maxDisplay) {
                //     soccerPlayers.setMaxDisplay(soccerPlayers.maxDisplay + 20);
                //     return;
                //   }
                // }}
              />
            ))}
          </Box>
        )}
      </PageContainer>
    </BaseContainer>
  );
});
