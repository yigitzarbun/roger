import React, { ChangeEvent } from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";

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
        <h3>Katılımcıları Filtrele</h3>
        <div className={styles["form-container"]}>
          <div className={styles["input-outer-container"]}>
            <div className={styles["search-container"]}>
              <input
                onChange={handleTextSearch}
                value={textSearch}
                type="text"
                placeholder="Oyuncularda ara"
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
          </div>
          <div className={styles["buttons-container"]}>
            <button onClick={handleClear} className={styles["discard-button"]}>
              Temizle
            </button>
            <button
              onClick={closeTournamentPlayersFilter}
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
export default TournamentPlayersFilterModal;
