import React from "react";

import PlayerRequestsHero from "../../../components/requests/player/hero/PlayerRequestsHero";
import PlayerRequestsNavigation from "../../../components/requests/player/navigation/PlayerRequestsNavigation";
import PlayerRequestsIncoming from "../../../components/requests/player/incoming/PlayerRequestsIncoming";
import PlayerRequestsOutgoing from "../../../components/requests/player/outgoing/PlayerRequestsOutgoing";
import { useState } from "react";
import styles from "./styles.module.scss";

const PlayerRequets = () => {
  const [display, setDisplay] = useState("incoming");
  const handleDisplay = (value: string) => {
    setDisplay(value);
  };
  return (
    <div className={styles["requests-container"]}>
      <PlayerRequestsHero />
      <PlayerRequestsNavigation
        display={display}
        handleDisplay={handleDisplay}
      />
      {display === "incoming" && <PlayerRequestsIncoming />}
      {display === "outgoing" && <PlayerRequestsOutgoing />}
    </div>
  );
};

export default PlayerRequets;
