import React from "react";

import { useState } from "react";

import PlayerAccountDetails from "../../../components/profile/player/account-details/PlayerAccountDetails";
import PlayerCardPayments from "../../../components/profile/player/card-payments/PlayerCardPayments";
import PlayerProfileHero from "../../../components/profile/player/hero/PlayerProfileHero";
import PlayerProfileNavigation from "../../../components/profile/player/navigation/PlayerProfileNavigation";
import PlayerStats from "../../../components/profile/player/stats/PlayerStats";

const PlayerProfile = () => {
  const [display, setDisplay] = useState("account-details");
  const handleDisplay = (value: string) => {
    setDisplay(value);
  };
  return (
    <div>
      <PlayerProfileHero />
      <PlayerProfileNavigation
        display={display}
        handleDisplay={handleDisplay}
      />
      {display === "account-details" && <PlayerAccountDetails />}
      {display === "card-payments" && <PlayerCardPayments />}
      {display === "stats" && <PlayerStats />}
    </div>
  );
};
export default PlayerProfile;
