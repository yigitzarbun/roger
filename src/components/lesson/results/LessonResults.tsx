import React, { ChangeEvent } from "react";
import { Link } from "react-router-dom";

import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";

import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetTrainerExperienceTypesQuery } from "../../../api/endpoints/TrainerExperienceTypesApi";
import { useGetClubsQuery } from "../../../api/endpoints/ClubsApi";
import { useGetTrainersQuery } from "../../../api/endpoints/TrainersApi";

interface TrainSearchProps {
  trainerLevelId: number;
  trainerPrice: number;
  gender: string;
  locationId: number;
  clubId: number;
}

const LessonResults = (props: TrainSearchProps) => {
  const { trainerLevelId, trainerPrice, gender, locationId, clubId } = props;
  const { user } = useAppSelector((store) => store.user);

  const {
    data: trainers,
    isLoading: isTrainersLoading,
    isError,
  } = useGetTrainersQuery({});

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const {
    data: trainerExperienceTypes,
    isLoading: istrainerExperienceTypesLoading,
  } = useGetTrainerExperienceTypesQuery({});

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const trainerLevelValue = Number(trainerLevelId) ?? null;
  const selectedGenderValue = gender ?? "";
  const locationIdValue = Number(locationId) ?? null;
  const clubIdValue = Number(clubId) ?? null;
  const trainerPriceValue = Number(trainerPrice) ?? null;

  const today = new Date();
  const year = today.getFullYear();

  const filteredTrainers =
    trainers &&
    trainers
      .filter((trainer) => trainer.user_id !== user.user.user_id)
      .filter((trainer) => {
        if (
          trainerLevelValue === 0 &&
          selectedGenderValue === "" &&
          locationIdValue === 0 &&
          clubIdValue === 0 &&
          trainerPriceValue === 0
        ) {
          return trainer;
        } else if (
          (trainerLevelValue === trainer.trainer_experience_type_id ||
            trainerLevelValue === 0) &&
          (selectedGenderValue === trainer.gender ||
            selectedGenderValue === "") &&
          (locationIdValue === trainer.location_id || locationIdValue === 0) &&
          (clubIdValue === trainer.club_id || clubIdValue === 0) &&
          (trainerPriceValue <= trainer.price_hour || trainerPriceValue === 100)
        ) {
          return trainer;
        }
      });

  if (isLocationsLoading || istrainerExperienceTypesLoading || isClubsLoading) {
    return <div>Yükleniyor..</div>;
  }

  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Ders</h2>
      </div>
      {isTrainersLoading && <p>Yükleniyor...</p>}
      {isError && <p>Bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>}
      {trainers && filteredTrainers.length === 0 && (
        <p>
          Aradığınız kritere göre eğitmen bulunamadı. Lütfen filtreyi temizleyip
          tekrar deneyin.
        </p>
      )}
      {trainers && filteredTrainers.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Eğitmen</th>
              <th>İsim</th>
              <th>Kulüp</th>
              <th>Tecrübe</th>
              <th>Cinsiyet</th>
              <th>Yaş</th>
              <th>Konum</th>
              <th>Fiyat (saat / TL)</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrainers.map((trainer) => (
              <tr key={trainer.trainer_id} className={styles["trainer-row"]}>
                <td>
                  <img
                    src={
                      trainer.image ? trainer.image : "/images/icons/avatar.png"
                    }
                    alt={trainer.name}
                    className={styles["trainer-image"]}
                  />
                </td>
                <td>{`${trainer.fname} ${trainer.lname}`}</td>
                <td>
                  {trainer.club_id
                    ? clubs?.find((club) => club.club_id === trainer.club_id)
                        .club_name
                    : "Ferdi / Bağımsız"}
                </td>
                <td>
                  {
                    trainerExperienceTypes?.find(
                      (trainer_experience_type) =>
                        trainer_experience_type.trainer_experience_type_id ===
                        trainer.trainer_experience_type_id
                    ).trainer_experience_type_name
                  }
                </td>
                <td>{trainer.gender}</td>
                <td>{year - Number(trainer.birth_year)}</td>
                <td>
                  {
                    locations?.find(
                      (location) => location.location_id === trainer.location_id
                    ).location_name
                  }
                </td>
                <td>{parseFloat(trainer.price_hour).toFixed(2)}</td>
                <td>
                  <Link
                    to={paths.TRAIN_INVITE}
                    state={{
                      fname: trainer.fname,
                      lname: trainer.lname,
                      image: trainer.image,
                      court_price: "100",
                    }}
                    className={styles["accept-button"]}
                  >
                    Davet gönder
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

export default LessonResults;
