import React from "react";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetCourtsQuery } from "../../../../api/endpoints/CourtsApi";
import { useGetClubTypesQuery } from "../../../../api/endpoints/ClubTypesApi";
import { useGetLocationsQuery } from "../../../../api/endpoints/LocationsApi";
import { useGetCourtSurfaceTypesQuery } from "../../../../api/endpoints/CourtSurfaceTypesApi";
import { useGetCourtStructureTypesQuery } from "../../../../api/endpoints/CourtStructureTypesApi";

import styles from "./styles.module.scss";

interface ExploreCourtProfileProps {
  court_id: string;
}
const ExploreCourtProfile = (props: ExploreCourtProfileProps) => {
  const { court_id } = props;

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});

  const { data: clubTypes, isLoading: isClubTypesLoading } =
    useGetClubTypesQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const { data: courtSurfaceTypes, isLoading: isCourtSurfaceTypesLoading } =
    useGetCourtSurfaceTypesQuery({});

  const { data: courtStructureTypes, isLoading: isCourtStructureTypesLoading } =
    useGetCourtStructureTypesQuery({});

  const selectedCourt = courts?.find(
    (court) => court.court_id === Number(court_id)
  );
  console.log(court_id);
  if (
    isClubsLoading ||
    isCourtsLoading ||
    isClubTypesLoading ||
    isLocationsLoading ||
    isLocationsLoading ||
    isCourtSurfaceTypesLoading ||
    isCourtStructureTypesLoading
  ) {
    return <div>Yükleniyor..</div>;
  }
  return (
    <div className={styles.profile}>
      <div className={styles["top-sections-container"]}>
        <div className={styles["profile-section"]}>
          <h3>Kort</h3>
          <img
            src={
              selectedCourt?.picture
                ? selectedCourt?.picture
                : "/images/icons/avatar.png"
            }
            alt="court_picture"
            className={styles["court-image"]}
          />
          <h2>{selectedCourt?.court_name}</h2>
          <p>
            {
              clubs?.find((club) => club.club_id === selectedCourt?.club_id)
                ?.club_name
            }
          </p>
          <p>{selectedCourt?.opening_time.slice(0, 5)}</p>
          <p>{selectedCourt?.closing_time.slice(0, 5)}</p>
          <p>{`${selectedCourt?.price_hour} TL / Saat`}</p>
          <p>
            {
              courtSurfaceTypes?.find(
                (type) =>
                  type.court_surface_type_id ===
                  selectedCourt?.court_surface_type_id
              )?.court_surface_type_name
            }
          </p>
          <p>
            {
              courtStructureTypes?.find(
                (type) =>
                  type.court_structure_type_id ===
                  selectedCourt?.court_structure_type_id
              )?.court_structure_type_name
            }
          </p>
        </div>
        <div className={styles["courts-section"]}>
          <h3>Takvim</h3>
          {courts?.filter((court) => court.club_id === selectedCourt?.club_id)
            .length > 0 ? (
            <table>
              <thead>
                <th>Kort</th>
                <th>Yüzey</th>
                <th>Mekan</th>
                <th>Fiyat (TL / Saat)</th>
              </thead>
              <tbody>
                {courts
                  ?.filter((court) => court.club_id === selectedCourt?.club_id)
                  .map((court) => (
                    <tr>
                      <td>{court.court_name}</td>
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
                      <td>{court.price_hour}</td>
                      <td>
                        <Link
                          to={`${paths.EXPLORE_PROFILE}kort/${court.court_id} `}
                        >
                          Görüntüle
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p>Henüz kulübe ait kort bulunmamaktadır</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default ExploreCourtProfile;
