import React, { ChangeEvent } from "react";
import styles from "./styles.module.scss";

import { useGetLocationsQuery } from "../../../api/endpoints/LocationsApi";
import { useGetTrainerExperienceTypesQuery } from "../../../api/endpoints/TrainerExperienceTypesApi";
import { useGetClubsQuery } from "../../../api/endpoints/ClubsApi";
import PageLoading from "../../../components/loading/PageLoading";

interface PlayerTrainersSearchProps {
  handleLevel: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleGender: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleLocation: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClub: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
  trainerLevelId: number;
  gender: string;
  locationId: number;
  clubId: number;
  textSearch: string;
}

const PlayerTrainersSearch = (props: PlayerTrainersSearchProps) => {
  const {
    handleLevel,
    handleGender,
    handleLocation,
    handleClub,
    handleTextSearch,
    handleClear,
    trainerLevelId,
    gender,
    locationId,
    clubId,
    textSearch,
  } = props;

  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationsQuery({});

  const {
    data: trainerExperienceTypes,
    isLoading: istrainerExperienceTypesLoading,
  } = useGetTrainerExperienceTypesQuery({});

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});
  if (isLocationsLoading || istrainerExperienceTypesLoading || isClubsLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["lesson-page-container"]}>
      <div className={styles["search-container"]}>
        <input
          type="text"
          onChange={handleTextSearch}
          value={textSearch}
          placeholder="Eğitmen adı"
        />
      </div>
      <div className={styles["input-container"]}>
        <select
          onChange={handleLevel}
          value={trainerLevelId ?? ""}
          className="input-element"
        >
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
        <select
          onChange={handleGender}
          value={gender}
          className="input-element"
        >
          <option value="">-- Cinsiyet --</option>
          <option value="female">Kadın</option>
          <option value="male">Erkek</option>
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select
          onChange={handleLocation}
          value={locationId ?? ""}
          className="input-element"
        >
          <option value="">-- Konum --</option>
          {locations?.map((location) => (
            <option key={location.location_id} value={location.location_id}>
              {location.location_name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select
          onChange={handleClub}
          value={clubId ?? ""}
          className="input-element"
        >
          <option value="">-- Kulüp --</option>
          {clubs?.map((club) => (
            <option key={club.club_id} value={club.club_id}>
              {club.club_name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleClear}
        className={
          trainerLevelId > 0 ||
          textSearch !== "" ||
          gender !== "" ||
          locationId > 0 ||
          clubId > 0
            ? styles["active-clear-button"]
            : styles["passive-clear-button"]
        }
      >
        Temizle
      </button>
    </div>
  );
};
export default PlayerTrainersSearch;
