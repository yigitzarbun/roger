import React from "react";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import { User } from "../../../../store/slices/authSlice";
import { Location } from "../../../../api/endpoints/LocationsApi";
import { Trainer } from "../../../../api/endpoints/TrainersApi";
import { TrainerExperienceType } from "../../../../api/endpoints/TrainerExperienceTypesApi";

interface ExploreTrainersProps {
  user: User;
  trainers: Trainer[];
  locations: Location[];
  trainerExperienceTypes: TrainerExperienceType[];
  isTrainersLoading: boolean;
  isLocationsLoading: boolean;
  isTrainerExperienceTypesLoading: boolean;
}
const ExploreTrainers = (props: ExploreTrainersProps) => {
  const {
    user,
    trainers,
    locations,
    trainerExperienceTypes,
    isTrainersLoading,
    isLocationsLoading,
    isTrainerExperienceTypesLoading,
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
    isTrainersLoading ||
    isLocationsLoading ||
    isTrainerExperienceTypesLoading
  ) {
    return <div>Yükleniyor..</div>;
  }
  return (
    <div className={styles["result-container"]}>
      <div className={styles["top-container"]}>
        <h2 className={styles["result-title"]}>Oyuncuları Keşfet</h2>
      </div>
      {trainers && trainers.length === 0 && (
        <p>
          Aradığınız kritere göre oyuncu bulunamadı. Lütfen filtreyi temizleyip
          tekrar deneyin.
        </p>
      )}
      {trainers && trainers.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Eğitmen</th>
              <th>İsim</th>
              <th>Seviye</th>
              <th>Ücret (Saat / TL)</th>
              <th>Cinsiyet</th>
              <th>Yaş</th>
              <th>Konum</th>
            </tr>
          </thead>
          <tbody>
            {trainers.map((trainer) => (
              <tr key={trainer.trainer_id} className={styles["trainer-row"]}>
                <td>
                  <img
                    src={
                      trainer.image ? trainer.image : "/images/icons/avatar.png"
                    }
                    alt={trainer.fname}
                    className={styles["trainer-image"]}
                  />
                </td>
                <td>{`${trainer.fname} ${trainer.lname}`}</td>
                <td>
                  {
                    trainerExperienceTypes?.find(
                      (type) =>
                        type.trainer_experience_type_id ===
                        trainer.trainer_experience_type_id
                    ).trainer_experience_type_name
                  }
                </td>
                <td>{trainer?.price_hour}</td>
                <td>{trainer.gender}</td>
                <td>{year - Number(trainer.birth_year)}</td>
                <td>
                  {
                    locations?.find(
                      (location) => location.location_id === trainer.location_id
                    ).location_name
                  }
                </td>
                {isUserPlayer && (
                  <td>
                    <Link
                      to={paths.LESSON_INVITE}
                      state={{
                        fname: trainer.fname,
                        lname: trainer.lname,
                        image: trainer.image,
                        court_price: "",
                        user_id: trainer.user_id,
                      }}
                    >
                      Derse davet et
                    </Link>
                  </td>
                )}
                {isUserPlayer && <td>Abone ol</td>}
                <Link to={`${paths.EXPLORE_PROFILE}2/${trainer.user_id} `}>
                  Görüntüle
                </Link>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExploreTrainers;
