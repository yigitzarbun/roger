import React from "react";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import { User } from "../../../../store/slices/authSlice";
import { Club } from "../../../../api/endpoints/ClubsApi";
import { Location } from "../../../../api/endpoints/LocationsApi";
import { ClubType } from "../../../../api/endpoints/ClubTypesApi";
import { Court } from "../../../../api/endpoints/CourtsApi";

interface ExploreClubsProps {
  user: User;
  clubs: Club[];
  locations: Location[];
  clubTypes: ClubType[];
  courts: Court[];
  isClubsLoading: boolean;
  isLocationsLoading: boolean;
  isClubTypesLoading: boolean;
  isCourtsLoading: boolean;
}
const ExploreClubs = (props: ExploreClubsProps) => {
  const {
    user,
    clubs,
    locations,
    clubTypes,
    courts,
    isClubsLoading,
    isLocationsLoading,
    isClubTypesLoading,
    isCourtsLoading,
  } = props;

  let isUserPlayer = false;
  let isUserTrainer = false;
  let isUserClub = false;

  if (user) {
    isUserPlayer = user.user.user_type_id === 1;
    isUserTrainer = user.user.user_type_id === 2;
    isUserClub = user.user.user_type_id === 3;
  }

  const currentDate = new Date();
  const year = currentDate.getFullYear();

  if (
    isClubsLoading ||
    isLocationsLoading ||
    isClubTypesLoading ||
    isCourtsLoading
  ) {
    return <div>Yükleniyor..</div>;
  }
  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Kulüpleri Keşfet</h2>
      </div>
      {clubs && clubs.length === 0 && (
        <p>
          Aradığınız kritere göre oyuncu bulunamadı. Lütfen filtreyi temizleyip
          tekrar deneyin.
        </p>
      )}
      {clubs && clubs.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Kulüp</th>
              <th>İsim</th>
              <th>Tür</th>
              <th>Konum</th>
              <th>Kort Adet</th>
            </tr>
          </thead>
          <tbody>
            {clubs.map((club) => (
              <tr key={club.club_id} className={styles["club-row"]}>
                <td>
                  <img
                    src={"/images/icons/avatar.png"}
                    alt={"club-iamge"}
                    className={styles["club-image"]}
                  />
                </td>
                <td>{`${club.club_name}`}</td>
                <td>
                  {
                    clubTypes?.find(
                      (type) => type.club_type_id === club.club_type_id
                    )?.club_type_name
                  }
                </td>
                <td>
                  {
                    locations?.find(
                      (location) => location.location_id === club.location_id
                    ).location_name
                  }
                </td>
                <td>
                  {
                    courts?.filter((court) => court.club_id === club.club_id)
                      ?.length
                  }
                </td>
                {isUserPlayer && <td>Üye ol</td>}
                <td>
                  <Link to={`${paths.EXPLORE_PROFILE}3/${club.user_id} `}>
                    Görüntüle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExploreClubs;
