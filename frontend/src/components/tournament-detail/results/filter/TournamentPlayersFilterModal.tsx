import React, { ChangeEvent } from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

interface TournamentPlayersFilterModalProps {
  textSearch: string;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
  playerLevelId: number;
  handlePlayerLevel: (event: ChangeEvent<HTMLSelectElement>) => void;
  playerLevels: any[];
  openTournamentPlayersFilter: boolean;
  closeTournamentPlayersFilter: () => void;
}
const TournamentPlayersFilterModal = (
  props: TournamentPlayersFilterModalProps
) => {
  const {
    textSearch,
    handleTextSearch,
    handleClear,
    playerLevelId,
    handlePlayerLevel,
    playerLevels,
    openTournamentPlayersFilter,
    closeTournamentPlayersFilter,
  } = props;

  const { t } = useTranslation();

  return (
    <ReactModal
      isOpen={openTournamentPlayersFilter}
      onRequestClose={closeTournamentPlayersFilter}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div
        className={styles["overlay"]}
        onClick={closeTournamentPlayersFilter}
      />
      <div className={styles["modal-content"]}>
        <h3>{t("filterParticipants")}</h3>
        <div className={styles["form-container"]}>
          <div className={styles["input-outer-container"]}>
            <div className={styles["search-container"]}>
              <input
                onChange={handleTextSearch}
                value={textSearch}
                type="text"
                placeholder={t("explorePlayersFilterSearchPlaceholder")}
              />
            </div>
          </div>
          <div className={styles["input-outer-container"]}>
            <div className={styles["input-container"]}>
              <select
                onChange={handlePlayerLevel}
                value={playerLevelId ?? ""}
                className="input-element"
              >
                <option value="">-- {t("playerLevel")} --</option>
                {playerLevels?.map((player_level) => (
                  <option
                    key={player_level.player_level_id}
                    value={player_level.player_level_id}
                  >
                    {player_level?.player_level_id === 1
                      ? t("playerLevelBeginner")
                      : player_level?.player_level_id === 2
                      ? t("playerLevelIntermediate")
                      : player_level?.player_level_id === 3
                      ? t("playerLevelAdvanced")
                      : t("playerLevelProfessinal")}
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
              onClick={closeTournamentPlayersFilter}
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
export default TournamentPlayersFilterModal;
