import React, { ChangeEvent } from "react";

import styles from "./styles.module.scss";

import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetTrainerExperienceTypesQuery } from "../../../api/endpoints/TrainerExperienceTypesApi";
import { useGetClubsQuery } from "../../../api/endpoints/ClubsApi";

interface TrainSearchProps {
  handleLevel: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleGender: (event: ChangeEvent<HTMLSelectElement>) => void;
  handlePrice: (event: ChangeEvent<HTMLInputElement>) => void;
  handleLocation: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClub: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClear: () => void;
  trainerLevelId: number;
  trainerPrice: number;
  gender: string;
  locationId: number;
  clubId: number;
}

const LessonSearch = (props: TrainSearchProps) => {
  const {
    handleLevel,
    handleGender,
    handlePrice,
    handleLocation,
    handleClub,
    handleClear,
    trainerLevelId,
    trainerPrice,
    gender,
    locationId,
    clubId,
  } = props;

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const {
    data: trainerExperienceTypes,
    isLoading: istrainerExperienceTypesLoading,
  } = useGetTrainerExperienceTypesQuery({});

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  if (isLocationsLoading || istrainerExperienceTypesLoading || isClubsLoading) {
    return <div>Yükleniyor..</div>;
  }

  return (
    <div className={styles["lesson-page-container"]}>
      <div className={styles["input-container"]}>
        <select onChange={handleLevel} value={trainerLevelId ?? ""}>
          <option value="">-- Seviye --</option>
          {trainerExperienceTypes?.map((trainer_experience_type) => (
            <option
              key={trainer_experience_type.trainer_experience_type_id}
              value={trainer_experience_type.trainer_experience_type_id}
            >
              {trainer_experience_type.trainer_experience_type_name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select onChange={handleGender} value={gender}>
          <option value="">-- Cinsiyet --</option>
          <option value="female">Kadın</option>
          <option value="male">Erkek</option>
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select onChange={handleLocation} value={locationId ?? ""}>
          <option value="">-- Konum --</option>
          {locations?.map((location) => (
            <option key={location.location_id} value={location.location_id}>
              {location.location_name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select onChange={handleClub} value={clubId ?? ""}>
          <option value="">-- Kulüp --</option>
          {clubs?.map((club) => (
            <option key={club.club_id} value={club.club_id}>
              {club.club_name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles["price-input"]}>
        <label> {`Fiyat:  ${trainerPrice} TL`}</label>
        <input
          type="range"
          id="trainerPrice"
          name="trainerPrice"
          min="0"
          max="750"
          defaultValue={100}
          onChange={handlePrice}
        />
      </div>
      <button onClick={handleClear} className={styles["button"]}>
        Temizle
      </button>
    </div>
  );
};

export default LessonSearch;
