import React, { useState } from "react";

import styles from "./styles.module.scss";

import TrainerRequestsHero from "../../../components/requests/trainer/hero/TrainerRequestsHero";
import TrainerRequestsNavigation from "../../../components/requests/trainer/navigation/TrainerRequestsNavigation";
import TrainerRequestsIncoming from "../../../components/requests/trainer/incoming/TrainerRequestsIncoming";
import TrainerRequestsOutgoing from "../../../components/requests/trainer/outgoing/TrainerRequestsOutgoing";

const TrainerRequests = () => {
  const [display, setDisplay] = useState("outgoing");
  const handleDisplay = (value: string) => {
    setDisplay(value);
  };
  return (
    <div className={styles["requests-container"]}>
      <TrainerRequestsHero />
      <TrainerRequestsNavigation
        display={display}
        handleDisplay={handleDisplay}
      />
      {display === "incoming" && <TrainerRequestsIncoming />}
      {display === "outgoing" && <TrainerRequestsOutgoing />}
    </div>
  );
};

export default TrainerRequests;
