import React, { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { useGetLocationsQuery } from "../../../../api/endpoints/LocationsApi";
import { useGetTrainerExperienceTypesQuery } from "../../../../api/endpoints/TrainerExperienceTypesApi";
import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import PageLoading from "../../../components/loading/PageLoading";

interface TrainSearchProps {
  handleLevel: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleGender: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleLocation: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClub: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleFavourite: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleClear: () => void;
  trainerLevelId: number;
  gender: string;
  locationId: number;
  clubId: number;
  textSearch: string;
  favourite: boolean | null;
}

const LessonSearch = (props: TrainSearchProps) => {
  const {
    handleLevel,
    handleGender,
    handleLocation,
    handleClub,
    handleFavourite,
    handleTextSearch,
    handleClear,
    trainerLevelId,
    gender,
    locationId,
    clubId,
    favourite,
    textSearch,
  } = props;
  const { t } = useTranslation();

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
          placeholder={t("exploreTrainersFilterSearchPlaceholder")}
        />
      </div>
      <div className={styles["input-container"]}>
        <select
          onChange={handleLevel}
          value={trainerLevelId ?? ""}
          className="input-element"
        >
          <option value="">-- {t("tableLevelHeader")} --</option>
          {trainerExperienceTypes?.map((trainer_experience_type) => (
            <option
              key={trainer_experience_type.trainer_experience_type_id}
              value={trainer_experience_type.trainer_experience_type_id}
            >
              {trainer_experience_type?.trainer_experience_type_id === 1
                ? t("trainerLevelBeginner")
                : trainer_experience_type?.trainer_experience_type_id === 2
                ? t("trainerLevelIntermediate")
                : trainer_experience_type?.trainer_experience_type_id === 3
                ? t("trainerLevelAdvanced")
                : t("trainerLevelProfessional")}
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
          <option value="">-- {t("gender")} --</option>
          <option value="female">{t("female")}</option>
          <option value="male">{t("male")}</option>
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select
          onChange={handleLocation}
          value={locationId ?? ""}
          className="input-element"
        >
          <option value="">-- {t("allLocations")} --</option>
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
          <option value="">-- {t("allClubs")} --</option>
          {clubs?.map((club) => (
            <option key={club.club_id} value={club.club_id}>
              {club.club_name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles["input-container"]}>
        <select
          onChange={handleFavourite}
          value={favourite ? "true" : "false"}
          className="input-element"
        >
          <option key={1} value={"false"}>
            -- {t("trainers")} --
          </option>
          <option key={2} value={"true"}>
            {t("onlyFavourites")}
          </option>
        </select>
      </div>
      <button
        onClick={handleClear}
        className={
          trainerLevelId > 0 ||
          textSearch !== "" ||
          gender !== "" ||
          locationId > 0 ||
          clubId > 0 ||
          favourite === true
            ? styles["active-clear-button"]
            : styles["passive-clear-button"]
        }
      >
        {t("clearButtonText")}
      </button>
    </div>
  );
};

export default LessonSearch;
