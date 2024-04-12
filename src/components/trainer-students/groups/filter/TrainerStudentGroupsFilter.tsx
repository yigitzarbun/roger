import React, { ChangeEvent } from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";

interface TrainerStudentGroupsFilterModalProps {
  textSearch: string;
  isTrainerStudentGroupsFilterOpen: boolean;
  handleCloseTrainerStudentGroupsFilter: () => void;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
}
const TrainerStudentGroupsFilterModal = (
  props: TrainerStudentGroupsFilterModalProps
) => {
  const {
    textSearch,
    handleTextSearch,
    handleClear,
    isTrainerStudentGroupsFilterOpen,
    handleCloseTrainerStudentGroupsFilter,
  } = props;
  return (
    <ReactModal
      isOpen={isTrainerStudentGroupsFilterOpen}
      onRequestClose={handleCloseTrainerStudentGroupsFilter}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div
        className={styles["overlay"]}
        onClick={handleCloseTrainerStudentGroupsFilter}
      />
      <div className={styles["modal-content"]}>
        <h3>Grupları Filtrele</h3>
        <div className={styles["form-container"]}>
          <div className={styles["search-container"]}>
            <input
              type="text"
              onChange={handleTextSearch}
              value={textSearch}
              placeholder="Grup, kulüp veya oyuncu adı"
            />
          </div>
          <div className={styles["buttons-container"]}>
            <button onClick={handleClear} className={styles["discard-button"]}>
              Temizle
            </button>
            <button
              onClick={handleCloseTrainerStudentGroupsFilter}
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
export default TrainerStudentGroupsFilterModal;
