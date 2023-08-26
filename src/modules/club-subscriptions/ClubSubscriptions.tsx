import React, { useState } from "react";

import styles from "./styles.module.scss";

import ClubSubscriptionsHero from "../../components/club-subscriptions/hero/ClubSubscriptionsHero";
import ClubSubscriptionsNavigation from "../../components/club-subscriptions/navigation/ClubSubscriptionsNavigation";
import ClubSubscriptionPackages from "../../components/club-subscriptions/subscription-packages/ClubSubscriptionPackages";
import ClubSubscribersResults from "../../components/club-subscriptions/subscriber-list/ClubSubscribersResults";
import ClubGroupsResults from "../../components/club-subscriptions/groups-list/ClubGroupsResults";

const ClubSubscriptions = () => {
  const [display, setDisplay] = useState("subscriptions");
  const handleDisplay = (value: string) => {
    setDisplay(value);
  };
  return (
    <div className={styles["club-subscriptions-container"]}>
      <ClubSubscriptionsHero />
      <ClubSubscriptionsNavigation
        display={display}
        handleDisplay={handleDisplay}
      />
      {display === "subscriptions" && <ClubSubscriptionPackages />}
      {display === "subscribers" && <ClubSubscribersResults />}
      {display === "groups" && <ClubGroupsResults />}
    </div>
  );
};
export default ClubSubscriptions;
