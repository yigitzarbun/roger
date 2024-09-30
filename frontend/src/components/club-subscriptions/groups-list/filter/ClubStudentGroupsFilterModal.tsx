import React, { ChangeEvent } from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

interface ClubStudentGroupsFilterModalProps {
  textSearch: string;
  isClubStudentGroupsFilterOpen: boolean;
  handleCloseClubStudentGroupsFilter: () => void;
  handleTextSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
}
const ClubStudentGroupsFilterModal = (
  props: ClubStudentGroupsFilterModalProps
) => {
  const {
    textSearch,
    handleTextSearch,
    handleClear,
    isClubStudentGroupsFilterOpen,
    handleCloseClubStudentGroupsFilter,
  } = props;

  const { t } = useTranslation();

  return (
    <ReactModal
      isOpen={isClubStudentGroupsFilterOpen}
      onRequestClose={handleCloseClubStudentGroupsFilter}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div
        className={styles["overlay"]}
        onClick={handleCloseClubStudentGroupsFilter}
      />
      <div className={styles["modal-content"]}>
        <h3>{t("filterGroups")}</h3>
        <div className={styles["form-container"]}>
          <div className={styles["search-container"]}>
            <input
              type="text"
              onChange={handleTextSearch}
              value={textSearch}
              placeholder={t("groupTrainerPlayerName")}
            />
          </div>
          <div className={styles["buttons-container"]}>
            <button onClick={handleClear} className={styles["discard-button"]}>
              {t("clearButtonText")}
            </button>
            <button
              onClick={handleCloseClubStudentGroupsFilter}
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
export default ClubStudentGroupsFilterModal;
