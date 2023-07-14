import React from "react";

import PlayerAccountDetails from "../../../components/profile/player/account-details/PlayerAccountDetails";
import PlayerCardPayments from "../../../components/profile/player/card-payments/PlayerCardPayments";
import PlayerProfileHero from "../../../components/profile/player/hero/PlayerProfileHero";
import PlayerStats from "../../../components/profile/player/stats/PlayerStats";

import styles from "./styles.module.scss";
import PlayerSubscriptions from "../../../components/profile/player/subscriptions/PlayerSubscriptions";

const PlayerProfile = () => {
  return (
    <div className={styles["player-profile-container"]}>
      <PlayerProfileHero />
      <PlayerAccountDetails />
      <PlayerCardPayments />
      <PlayerStats />
      <PlayerSubscriptions />
    </div>
  );
};
export default PlayerProfile;
