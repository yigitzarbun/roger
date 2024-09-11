import React, { ChangeEvent } from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();

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
        <h3>{t("filterGroupsTitle")}</h3>
        <div className={styles["form-container"]}>
          <div className={styles["search-container"]}>
            <input
              type="text"
              onChange={handleTextSearch}
              value={textSearch}
              placeholder={t("filterGroupsPlaceholder")}
            />
          </div>
          <div className={styles["buttons-container"]}>
            <button onClick={handleClear} className={styles["discard-button"]}>
              {t("clearButtonText")}
            </button>
            <button
              onClick={handleCloseTrainerStudentGroupsFilter}
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
export default TrainerStudentGroupsFilterModal;
