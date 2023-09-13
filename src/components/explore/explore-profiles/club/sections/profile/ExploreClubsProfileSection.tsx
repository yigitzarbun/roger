import React from "react";

import { FaLocationDot } from "react-icons/fa6";
import { CgTennis } from "react-icons/cg";

import styles from "./styles.module.scss";

import PageLoading from "../../../../../../components/loading/PageLoading";

import { localUrl } from "../../../../../../common/constants/apiConstants";

import { useGetClubTypesQuery } from "../../../../../../api/endpoints/ClubTypesApi";

import { useGetLocationsQuery } from "../../../../../../api/endpoints/LocationsApi";
import { Club } from "../../../../../../api/endpoints/ClubsApi";

interface ExploreClubsProfileSectionProps {
  selectedClub: Club;
}
const ExploreClubsProfileSection = (props: ExploreClubsProfileSectionProps) => {
  const { selectedClub } = props;

  const { data: clubTypes, isLoading: isClubTypesLoading } =
    useGetClubTypesQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const profileImage = selectedClub?.[0]?.image;

  if (isClubTypesLoading || isLocationsLoading) {
    return <PageLoading />;
  }

  return (
    <div className={styles["profile-section"]}>
      <h2>Kulüp</h2>
      <div className={styles["profile-data-container"]}>
        <img
          src={
            profileImage
              ? `${localUrl}/${profileImage}`
              : "/images/icons/avatar.png"
          }
          alt="club picture"
          className={styles["profile-image"]}
        />
        <div className={styles["secondary-profile-data-container"]}>
          <h3>{selectedClub?.[0]?.club_name}</h3>
          <div className={styles["profile-info"]}>
            <CgTennis className={styles.icon} />
            <p className={styles["info-text"]}>
              {
                clubTypes?.find(
                  (type) =>
                    type.club_type_id === selectedClub?.[0]?.club_type_id
                )?.club_type_name
              }
            </p>
          </div>
          <div className={styles["profile-info"]}>
            <FaLocationDot className={styles.icon} />
            <p className={styles["info-text"]}>
              {
                locations?.find(
                  (location) =>
                    location.location_id === selectedClub?.[0]?.location_id
                )?.location_name
              }
            </p>
          </div>
          <div className={styles["profile-info"]}>
            <FaLocationDot className={styles.icon} />
            <address className={styles["info-text"]}>
              {selectedClub?.[0]?.club_address}
            </address>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreClubsProfileSection;
