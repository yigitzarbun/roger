import React, { useState } from "react";

import PlayerCardPayments from "../../../components/profile/player/card-payments/PlayerCardPayments";

import styles from "./styles.module.scss";
import PlayerProfileNavigation from "../../../components/profile/player/player-profile-nav/PlayerProfileNavigation";
import { useAppSelector } from "../../../store/hooks";
import { useGetPlayerProfileDetailsQuery } from "../../../api/endpoints/PlayersApi";
import PageLoading from "../../../components/loading/PageLoading";
import PlayerAccountDetails from "../../../components/profile/player/account-details/PlayerAccountDetails";
import PlayerOtherDetails from "../../../components/profile/player/other-details/PlayerOtherDetails";

const PlayerProfile = () => {
  const user = useAppSelector((store) => store?.user?.user);
  const {
    data: playerDetails,
    isLoading: isPlayerDetailsLoading,
    refetch: refetchPlayerDetails,
  } = useGetPlayerProfileDetailsQuery(user?.user?.user_id);

  const [page, setPage] = useState("account");

  const handlePage = (page: string) => {
    setPage(page);
  };

  if (isPlayerDetailsLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["player-profile-container"]}>
      <div className={styles["title-container"]}>
        <h2>Hesap Ayarları</h2>
      </div>
      <div className={styles.main}>
        <PlayerProfileNavigation handlePage={handlePage} page={page} />
        <div className={styles.sections}>
          {page === "account" && (
            <PlayerAccountDetails
              playerDetails={playerDetails}
              refetchPlayerDetails={refetchPlayerDetails}
            />
          )}
          {page === "payment" && (
            <PlayerCardPayments
              playerDetails={playerDetails}
              refetchPlayerDetails={refetchPlayerDetails}
            />
          )}
          {page === "other" && (
            <PlayerOtherDetails
              playerDetails={playerDetails}
              refetchPlayerDetails={refetchPlayerDetails}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default PlayerProfile;
