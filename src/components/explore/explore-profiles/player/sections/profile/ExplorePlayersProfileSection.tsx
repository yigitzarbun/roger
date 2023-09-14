import React from "react";

import { FaGenderless, FaCalendarDays, FaLocationDot } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { CgTennis } from "react-icons/cg";

import { localUrl } from "../../../../../../common/constants/apiConstants";

import PageLoading from "../../../../../../components/loading/PageLoading";

import styles from "./styles.module.scss";

import { Player } from "../../../../../../api/endpoints/PlayersApi";
import { useGetLocationsQuery } from "../../../../../../api/endpoints/LocationsApi";
import { useGetPlayerLevelsQuery } from "../../../../../../api/endpoints/PlayerLevelsApi";
import { useGetClubSubscriptionsByFilterQuery } from "../../../../../../api/endpoints/ClubSubscriptionsApi";
import { Club } from "../../../../../../api/endpoints/ClubsApi";

interface ExplorePlayersProfileSectionProps {
  selectedPlayer: Player;
  clubs: Club[];
}
const ExplorePlayersProfileSection = (
  props: ExplorePlayersProfileSectionProps
) => {
  const { selectedPlayer, clubs } = props;

  const profileImage = selectedPlayer?.[0]?.image;

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: playerLevels, isLoading: isPlayerLevelsLoading } =
    useGetPlayerLevelsQuery({});

  const {
    data: selectedPlayerSubscriptions,
    isLoading: isSelectedPlayerSubscriptionsLoading,
  } = useGetClubSubscriptionsByFilterQuery({
    player_id: selectedPlayer?.[0]?.user_id,
    is_active: true,
  });

  // TO DO: move filtering logic to backend
  const selectedPlayerSubscriptionClubNames = [];

  if (selectedPlayerSubscriptions?.length > 0) {
    selectedPlayerSubscriptions.forEach((subscription) => {
      const clubName = clubs?.find(
        (club) => club.user_id === subscription.club_id
      )?.club_name;
      selectedPlayerSubscriptionClubNames.push(clubName);
    });
  }

  if (
    isLocationsLoading ||
    isPlayerLevelsLoading ||
    isSelectedPlayerSubscriptionsLoading
  ) {
    return <PageLoading />;
  }

  return (
    <div className={styles["profile-section"]}>
      <h2>Oyuncu</h2>
      <div className={styles["profile-data-container"]}>
        <img
          src={
            profileImage
              ? `${localUrl}/${profileImage}`
              : "/images/icons/avatar.png"
          }
          alt="player picture"
          className={styles["profile-image"]}
        />
        <div className={styles["secondary-profile-data-container"]}>
          <h2>{`${selectedPlayer?.[0]?.fname} ${selectedPlayer?.[0]?.lname}`}</h2>

          <div className={styles["profile-info"]}>
            <FaGenderless className={styles.icon} />
            <p className={styles["info-text"]}>{selectedPlayer?.[0]?.gender}</p>
          </div>
          <div className={styles["profile-info"]}>
            <FaCalendarDays className={styles.icon} />
            <p className={styles["info-text"]}>
              {selectedPlayer?.[0]?.birth_year}
            </p>
          </div>
          <div className={styles["profile-info"]}>
            <CgTennis className={styles.icon} />
            <p className={styles["info-text"]}>
              {
                playerLevels?.find(
                  (level) =>
                    level.player_level_id ===
                    selectedPlayer?.[0]?.player_level_id
                )?.player_level_name
              }
            </p>
          </div>
          <div className={styles["profile-info"]}>
            <FaLocationDot className={styles.icon} />
            <p className={styles["info-text"]}>
              {
                locations?.find(
                  (location) =>
                    location.location_id === selectedPlayer?.[0]?.location_id
                )?.location_name
              }
            </p>
          </div>
          <div className={styles["profile-info"]}>
            <FaUserFriends className={styles.icon} />
            <p className={styles["info-text"]}>
              {selectedPlayerSubscriptions?.length > 0
                ? selectedPlayerSubscriptionClubNames?.map((clubName) => (
                    <span key={clubName}>{clubName}</span>
                  ))
                : "Oyuncunun kulüp üyeliği bulunmamaktadır."}
            </p>
          </div>
          <p>{selectedPlayer?.[0]?.player_bio_description}</p>
        </div>
      </div>
    </div>
  );
};

export default ExplorePlayersProfileSection;
