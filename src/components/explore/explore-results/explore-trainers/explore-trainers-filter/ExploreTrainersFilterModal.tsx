import React from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";

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
        <h3>Eğitmenleri Filtrele</h3>
        <div className={styles["form-container"]}>
          <div className={styles["search-container"]}>
            <input
              type="text"
              onChange={handleTextSearch}
              value={textSearch}
              placeholder="Eğitmen adı"
            />
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <select
                onChange={handleTrainerExperience}
                value={trainerExperienceTypeId ?? ""}
                className="input-element"
              >
                <option value="">-- Seviye --</option>
                {trainerExperienceTypes?.map((player_level) => (
                  <option
                    key={player_level.trainer_experience_type_id}
                    value={player_level.trainer_experience_type_id}
                  >
                    {player_level.trainer_experience_type_name}
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
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <select
                onChange={handleLocation}
                value={locationId ?? ""}
                className="input-element"
              >
                <option value="">-- Tüm Konumlar --</option>
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
                <option value="">-- Tüm Kulüpler --</option>
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
              Temizle
            </button>
            <button
              onClick={handleCloseTrainerFilterModal}
              className={styles["submit-button"]}
            >
              Uygula
            </button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
};
export default ExploreTrainersFilterModal;
