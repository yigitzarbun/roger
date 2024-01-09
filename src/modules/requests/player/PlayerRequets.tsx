import React, { useState } from "react";

import PlayerRequestsNavigation from "../../../components/requests/player/navigation/PlayerRequestsNavigation";
import PlayerRequestsIncoming from "../../../components/requests/player/incoming/PlayerRequestsIncoming";
import PlayerRequestsOutgoing from "../../../components/requests/player/outgoing/PlayerRequestsOutgoing";

import styles from "./styles.module.scss";

const PlayerRequets = () => {
  const [display, setDisplay] = useState("outgoing");
  const handleDisplay = (value: string) => {
    setDisplay(value);
  };
  return (
    <div className={styles["requests-container"]}>
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
