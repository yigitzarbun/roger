import React from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";

const ExplorePlayersFilterModal = (props) => {
  const {
    isPlayerFilterModalOpen,
    handleClosePlayerFilterModal,
    locations,
    handleLocation,
    handleClear,
    locationId,
    handleTextSearch,
    textSearch,
    handleLevel,
    playerLevelId,
    playerLevels,
    handleGender,
    gender,
  } = props;
  return (
    <ReactModal
      isOpen={isPlayerFilterModalOpen}
      onRequestClose={handleClosePlayerFilterModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div
        className={styles["overlay"]}
        onClick={handleClosePlayerFilterModal}
      />
      <div className={styles["modal-content"]}>
        <h3>Oyuncuları Filtrele</h3>
        <div className={styles["form-container"]}>
          <div className={styles["search-container"]}>
            <input
              type="text"
              onChange={handleTextSearch}
              value={textSearch}
              placeholder="Oyuncu adı"
            />
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <select
                onChange={handleLevel}
                value={playerLevelId ?? ""}
                className="input-element"
              >
                <option value="">-- Seviye --</option>
                {playerLevels?.map((player_level) => (
                  <option
                    key={player_level.player_level_id}
                    value={player_level.player_level_id}
                  >
                    {player_level.player_level_name}
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
          </div>
          <div className={styles["buttons-container"]}>
            <button onClick={handleClear} className={styles["discard-button"]}>
              Temizle
            </button>
            <button
              onClick={handleClosePlayerFilterModal}
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
export default ExplorePlayersFilterModal;
