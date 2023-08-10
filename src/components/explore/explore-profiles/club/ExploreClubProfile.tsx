import React from "react";

import { Link } from "react-router-dom";

import paths from "../../../../routing/Paths";

import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetCourtsQuery } from "../../../../api/endpoints/CourtsApi";
import { useGetClubTypesQuery } from "../../../../api/endpoints/ClubTypesApi";
import { useGetLocationsQuery } from "../../../../api/endpoints/LocationsApi";
import { useGetCourtSurfaceTypesQuery } from "../../../../api/endpoints/CourtSurfaceTypesApi";
import { useGetCourtStructureTypesQuery } from "../../../../api/endpoints/CourtStructureTypesApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetTrainerExperienceTypesQuery } from "../../../../api/endpoints/TrainerExperienceTypesApi";

import styles from "./styles.module.scss";

interface ExploreClubProfileProps {
  user_id: string;
}
const ExploreClubProfile = (props: ExploreClubProfileProps) => {
  const { user_id } = props;

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

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const {
    data: trainerExperienceTypes,
    isLoading: isTrainerExperienceTypesLoading,
  } = useGetTrainerExperienceTypesQuery({});

  const selectedClub = clubs?.find((club) => club.user_id === Number(user_id));

  if (
    isClubsLoading ||
    isCourtsLoading ||
    isClubTypesLoading ||
    isLocationsLoading ||
    isLocationsLoading ||
    isCourtSurfaceTypesLoading ||
    isCourtStructureTypesLoading ||
    isTrainersLoading ||
    isTrainerExperienceTypesLoading
  ) {
    return <div>Yükleniyor..</div>;
  }

  return (
    <div className={styles.profile}>
      <div className={styles["top-sections-container"]}>
        <div className={styles["profile-section"]}>
          <h3>Kulüp</h3>
          <img
            src={
              selectedClub?.picture
                ? selectedClub?.picture
                : "/images/icons/avatar.png"
            }
            alt="club_picture"
            className={styles["club-image"]}
          />
          <h2>{selectedClub?.club_name}</h2>
          <p>{selectedClub?.club_bio_description}</p>
          <p>
            {
              clubTypes?.find(
                (type) => type.club_type_id === selectedClub?.club_type_id
              )?.club_type_name
            }
          </p>
          <p>
            {
              locations?.find(
                (location) => location.location_id === selectedClub?.location_id
              )?.location_name
            }
          </p>
          <address>{selectedClub?.club_address}</address>
        </div>
        <div className={styles["courts-section"]}>
          <h3>Kortlar</h3>
          {courts?.filter((court) => court.club_id === selectedClub?.club_id)
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
                  ?.filter((court) => court.club_id === selectedClub?.club_id)
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
                      <Link
                        to={`${paths.EXPLORE_PROFILE}kort/${court.court_id} `}
                      >
                        Görüntüle
                      </Link>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p>Henüz kulübe ait kort bulunmamaktadır</p>
          )}
        </div>
      </div>
      <div className={styles["bottom-sections-container"]}>
        <div className={styles["subscription-section"]}>
          <h3>Favoriler</h3>
          <p>163 oyuncu favorilere ekledi</p>
          <button>Favorilere ekle</button>
        </div>
        <div className={styles["trainers-section"]}>
          <h3>Eğitmenler</h3>
          {trainers?.filter(
            (trainer) => trainer.club_id === selectedClub?.club_id
          ).length > 0 ? (
            <table>
              <thead>
                <th>İsim</th>
                <th>Soyisim</th>
                <th>Cinsiyet</th>
                <th>Tecrübe</th>
                <th>Fiyat (TL / Saat)</th>
              </thead>
              <tbody>
                {trainers
                  ?.filter(
                    (trainer) => trainer.club_id === selectedClub?.club_id
                  )
                  .map((trainer) => (
                    <tr>
                      <td>{trainer.fname}</td>
                      <td>{trainer.lname}</td>
                      <td>{trainer.gender}</td>
                      <td>
                        {
                          trainerExperienceTypes?.find(
                            (type) =>
                              type.trainer_experience_type_id ===
                              trainer.trainer_experience_type_id
                          )?.trainer_experience_type_name
                        }
                      </td>
                      <td>{trainer.price_hour}</td>
                      <Link
                        to={`${paths.EXPLORE_PROFILE}2/${trainer.user_id} `}
                      >
                        Görüntüle
                      </Link>
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
export default ExploreClubProfile;
