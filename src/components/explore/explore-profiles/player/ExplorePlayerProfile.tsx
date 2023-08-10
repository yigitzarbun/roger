import React from "react";

import { useGetLocationsQuery } from "../../../../api/endpoints/LocationsApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import { useGetPlayerLevelsQuery } from "../../../../api/endpoints/PlayerLevelsApi";

import styles from "./styles.module.scss";

interface ExplorePlayerProfileProps {
  user_id: string;
}
const ExplorePlayerProfile = (props: ExplorePlayerProfileProps) => {
  const { user_id } = props;

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  const selectedPlayer = players?.find(
    (player) => player.user_id === Number(user_id)
  );

  if (
    isLocationsLoading ||
    isLocationsLoading ||
    isPlayersLoading ||
    isPlayerLevelsLoading
  ) {
    return <div>Yükleniyor..</div>;
  }

  return (
    <div className={styles.profile}>
      <div className={styles["top-sections-container"]}>
        <div className={styles["profile-section"]}>
          <h3>Oyuncu</h3>
          <img
            src={
              selectedPlayer?.picture
                ? selectedPlayer?.picture
                : "/images/icons/avatar.png"
            }
            alt="club_picture"
            className={styles["club-image"]}
          />
          <h2>{`${selectedPlayer?.fname} ${selectedPlayer.lname}`}</h2>
          <p>{selectedPlayer?.player_bio_description}</p>
          <p>{selectedPlayer?.gender}</p>
          <p>{selectedPlayer?.birth_year}</p>
          <p>
            {
              playerLevels?.find(
                (level) =>
                  level.player_level_id === selectedPlayer?.player_level_id
              )?.player_level_name
            }
          </p>
          <p>
            {
              locations?.find(
                (location) =>
                  location.location_id === selectedPlayer?.location_id
              )?.location_name
            }
          </p>
        </div>
        <div className={styles["subscription-section"]}>
          <h3>Etkileşim</h3>
          <button>Favorilere ekle</button>
          <button>Antreman Yap</button>
          <button>Maç Yap</button>
        </div>
      </div>
    </div>
  );
};
export default ExplorePlayerProfile;
