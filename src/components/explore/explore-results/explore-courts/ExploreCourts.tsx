import React from "react";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import { User } from "../../../../store/slices/authSlice";
import { Club } from "../../../../api/endpoints/ClubsApi";
import { Location } from "../../../../api/endpoints/LocationsApi";
import { Court } from "../../../../api/endpoints/CourtsApi";
import { CourtSurfaceType } from "api/endpoints/CourtSurfaceTypesApi";
import { CourtStructureType } from "api/endpoints/CourtStructureTypesApi";

interface ExploreCourtsProps {
  user: User;
  clubs: Club[];
  locations: Location[];
  courtSurfaceTypes: CourtSurfaceType[];
  courtStructureTypes: CourtStructureType[];
  courts: Court[];
  isClubsLoading: boolean;
  isLocationsLoading: boolean;
  isCourtsLoading: boolean;
  isCourtStructureTypesLoading: boolean;
  isCourtSurfaceTypesLoading: boolean;
}
const ExploreCourts = (props: ExploreCourtsProps) => {
  const {
    user,
    clubs,
    locations,
    courts,
    courtStructureTypes,
    courtSurfaceTypes,
    isClubsLoading,
    isLocationsLoading,
    isCourtStructureTypesLoading,
    isCourtSurfaceTypesLoading,
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

  if (
    isClubsLoading ||
    isLocationsLoading ||
    isCourtStructureTypesLoading ||
    isCourtsLoading ||
    isCourtSurfaceTypesLoading
  ) {
    return <div>Yükleniyor..</div>;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Kortları Keşfet</h2>
      </div>
      {courts && courts.length === 0 && (
        <p>
          Aradığınız kritere göre kort bulunamadı. Lütfen filtreyi temizleyip
          tekrar deneyin.
        </p>
      )}
      {courts && courts.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Kort</th>
              <th>İsim</th>
              <th>Açılış</th>
              <th>Kapanış</th>
              <th>Yüzey</th>
              <th>Mekan</th>
              <th>Fiyat (Saat / TL)</th>
              <th>Fiyat - Üye Olmayan (Saat / TL)</th>
              <th>Kulüp</th>
              <th>Konum</th>
              <th>Kort Statüsü</th>
            </tr>
          </thead>
          <tbody>
            {courts.map((court) => (
              <tr key={court.court_id} className={styles["court-row"]}>
                <td>
                  <img
                    src={"/images/icons/avatar.png"}
                    alt={"court-iamge"}
                    className={styles["court-image"]}
                  />
                </td>
                <td>{`${court.court_name}`}</td>
                <td>{court.opening_time.slice(0, 5)}</td>
                <td>{court.closing_time.slice(0, 5)}</td>
                <td>
                  {
                    courtSurfaceTypes?.find(
                      (type) =>
                        type.court_surface_type_id ===
                        court.court_surface_type_id
                    )?.court_surface_type_name
                  }
                </td>
                <td>
                  {
                    courtStructureTypes?.find(
                      (type) =>
                        type.court_structure_type_id ===
                        court.court_structure_type_id
                    )?.court_structure_type_name
                  }
                </td>
                <td>{court?.price_hour}</td>
                <td>
                  {clubs?.find((club) => club.club_id === court.club_id)
                    ?.higher_price_for_non_subscribers &&
                  court.price_hour_non_subscriber
                    ? court.price_hour_non_subscriber
                    : "-"}
                </td>
                <td>
                  {
                    clubs?.find((club) => club.club_id === court.club_id)
                      ?.club_name
                  }
                </td>
                <td>
                  {
                    locations?.find(
                      (location) =>
                        location.location_id ===
                        clubs?.find((club) => club.club_id === court.club_id)
                          ?.location_id
                    )?.location_name
                  }
                </td>
                <td>{court.is_active ? "Aktif" : "Bloke"}</td>
                {court.is_active && (
                  <td>
                    <Link
                      to={`${paths.EXPLORE_PROFILE}kort/${court.court_id} `}
                    >
                      Görüntüle
                    </Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExploreCourts;
