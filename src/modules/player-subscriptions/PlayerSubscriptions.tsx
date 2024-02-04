import React from "react";
import styles from "./styles.module.scss";
import PlayerSubscriptionResults from "../../components/player-subscriptions/PlayerSubscriptionsResults";

const PlayerSubscriptions = () => {
  return (
    <div className={styles["subscriptions-container"]}>
      <PlayerSubscriptionResults />
    </div>
  );
};

export default PlayerSubscriptions;
