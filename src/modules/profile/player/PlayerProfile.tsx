import React from "react";

import PlayerAccountDetails from "../../../components/profile/player/account-details/PlayerAccountDetails";
import PlayerCardPayments from "../../../components/profile/player/card-payments/PlayerCardPayments";

import styles from "./styles.module.scss";
import PlayerProfileNavigation from "../../../components/profile/player/player-profile-nav/PlayerProfileNavigation";
import { useAppSelector } from "../../../store/hooks";
import { useGetPlayerProfileDetailsQuery } from "../../../api/endpoints/PlayersApi";
import PageLoading from "../../../components/loading/PageLoading";

const PlayerProfile = () => {
  const user = useAppSelector((store) => store?.user?.user);
  const {
    data: playerDetails,
    isLoading: isPlayerDetailsLoading,
    refetch: refetchPlayerDetails,
  } = useGetPlayerProfileDetailsQuery(user?.user?.user_id);

  if (isPlayerDetailsLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["player-profile-container"]}>
      <div className={styles["title-container"]}>
        <h2>Hesap Ayarları</h2>
      </div>
      <div className={styles.main}>
        <PlayerProfileNavigation />
        <div className={styles.sections}>
          <PlayerAccountDetails
            playerDetails={playerDetails}
            refetch={refetchPlayerDetails}
          />
          <PlayerCardPayments />
        </div>
      </div>
    </div>
  );
};
export default PlayerProfile;
