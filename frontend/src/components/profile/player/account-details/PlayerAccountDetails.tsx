import React from "react";
import PlayerImage from "./player-image/PlayerImage";
import styles from "./styles.module.scss";
import PlayerName from "./player-name/PlayerName";
import PlayerAge from "./player-age/PlayerAge";
import PlayerLocation from "./player-location/PlayerLocation";
import PlayerLevel from "./player-level/PlayerLevel";
import PlayerGender from "./player-gender/PlayerGender";

const PlayerAccountDetails = (props) => {
  const { playerDetails, refetchPlayerDetails } = props;
  return (
    <div className={styles["player-account-details"]}>
      <PlayerImage
        playerDetails={playerDetails}
        refetchPlayerDetails={refetchPlayerDetails}
      />
      <PlayerName
        playerDetails={playerDetails}
        refetchPlayerDetails={refetchPlayerDetails}
      />
      <PlayerAge
        playerDetails={playerDetails}
        refetchPlayerDetails={refetchPlayerDetails}
      />
      <PlayerLocation
        playerDetails={playerDetails}
        refetchPlayerDetails={refetchPlayerDetails}
      />
      <PlayerLevel
        playerDetails={playerDetails}
        refetchPlayerDetails={refetchPlayerDetails}
      />
      <PlayerGender playerDetails={playerDetails} />
    </div>
  );
};
export default PlayerAccountDetails;
