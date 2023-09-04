import React, { useState } from "react";

import styles from "./styles.module.scss";

import PlayerSocialHero from "../../../components/social/player/hero/PlayerSocialHero";
import PlayerSocialNavigation from "../../../components/social/player/navigation/PlayerSocialNavigation";
import PlayerSubscriptionResults from "../../../components/social/player/subscriptions/PlayerSubscriptionResults";
import PlayerGroupResults from "../../../components/social/player/groups/PlayerGroupResults";
import PlayerFavouriteResults from "../../../components/social/player/favourites/PlayerFavouriteResults";

const PlayerSocial = () => {
  const [display, setDisplay] = useState("subscriptions");
  const handleDisplay = (value: string) => {
    setDisplay(value);
  };
  return (
    <div className={styles["social-container"]}>
      <PlayerSocialHero />
      <PlayerSocialNavigation display={display} handleDisplay={handleDisplay} />
      {display === "subscriptions" && <PlayerSubscriptionResults />}
      {display === "favourites" && <PlayerFavouriteResults />}
      {display === "groups" && <PlayerGroupResults />}
    </div>
  );
};

export default PlayerSocial;
