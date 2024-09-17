import React from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

const ExploreTrainersFilterModal = (props) => {
  const {
    isTrainerFilterModalOpen,
    handleCloseTrainerFilterModal,
    locations,
    handleLocation,
    handleClear,
    locationId,
    handleTextSearch,
    textSearch,
    handleTrainerExperience,
    trainerExperienceTypeId,
    trainerExperienceTypes,
    handleGender,
    gender,
    handleClubId,
    clubId,
    clubs,
  } = props;
  const { t } = useTranslation();

  return (
    <ReactModal
      isOpen={isTrainerFilterModalOpen}
      onRequestClose={handleCloseTrainerFilterModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div
        className={styles["overlay"]}
        onClick={handleCloseTrainerFilterModal}
      />
      <div className={styles["modal-content"]}>
        <h3>{t("exploreTrainersFilterTitle")}</h3>
        <div className={styles["form-container"]}>
          <div className={styles["search-container"]}>
            <input
              type="text"
              onChange={handleTextSearch}
              value={textSearch}
              placeholder={t("exploreTrainersFilterSearchPlaceholder")}
            />
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <select
                onChange={handleTrainerExperience}
                value={trainerExperienceTypeId ?? ""}
                className="input-element"
              >
                <option value="">-- {t("tableLevelHeader")} --</option>
                {trainerExperienceTypes?.map((trainer_level) => (
                  <option
                    key={trainer_level.trainer_experience_type_id}
                    value={trainer_level.trainer_experience_type_id}
                  >
                    {trainer_level?.trainer_experience_type_id === 1
                      ? t("trainerLevelBeginner")
                      : trainer_level?.trainer_experience_type_id === 2
                      ? t("trainerLevelIntermediate")
                      : trainer_level?.trainer_experience_type_id === 3
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
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <select
                onChange={handleLocation}
                value={locationId ?? ""}
                className="input-element"
              >
                <option value="">-- {t("allLocations")} --</option>
                {locations?.map((location) => (
                  <option
                    key={location.location_id}
                    value={location.location_id}
                  >
                    {location.location_name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles["input-container"]}>
              <select
                onChange={handleClubId}
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
          </div>
          <div className={styles["buttons-container"]}>
            <button onClick={handleClear} className={styles["discard-button"]}>
              {t("clearButtonText")}
            </button>
            <button
              onClick={handleCloseTrainerFilterModal}
              className={styles["submit-button"]}
            >
              {t("applyButtonText")}
            </button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
};
export default ExploreTrainersFilterModal;
