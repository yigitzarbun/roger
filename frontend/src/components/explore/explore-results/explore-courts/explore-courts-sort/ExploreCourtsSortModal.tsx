import React from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

interface ExploreCourtsSortModalProps {
  sortModalOpen: boolean;
  handleCloseSortModal: () => void;
  handleOrderBy: (e: string, f: string) => void;
  handleClearOrderBy: () => void;
  orderByDirection: string;
  orderByColumn: string;
}

const ExploreCourtsSortModal = (props: ExploreCourtsSortModalProps) => {
  const {
    sortModalOpen,
    handleCloseSortModal,
    handleOrderBy,
    handleClearOrderBy,
    orderByDirection,
    orderByColumn,
  } = props;
  const { t } = useTranslation();

  return (
    <ReactModal
      isOpen={sortModalOpen}
      onRequestClose={handleCloseSortModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={handleCloseSortModal} />
      <div className={styles["modal-content"]}>
        <h3>{t("sortCourtsTile")}</h3>
        <p
          onClick={() => handleOrderBy("court_name", "asc")}
          className={
            orderByDirection === "asc" && orderByColumn === "court_name"
              ? styles.active
              : styles.item
          }
        >
          {t("nameAsc")}
        </p>
        <p
          onClick={() => handleOrderBy("court_name", "desc")}
          className={
            orderByDirection === "desc" && orderByColumn === "court_name"
              ? styles.active
              : styles.item
          }
        >
          {t("nameDesc")}
        </p>
        <p
          onClick={() => handleOrderBy("club_name", "asc")}
          className={
            orderByDirection === "asc" && orderByColumn === "club_name"
              ? styles.active
              : styles.item
          }
        >
          {t("sortClubNameAsc")}
        </p>
        <p
          onClick={() => handleOrderBy("club_name", "desc")}
          className={
            orderByDirection === "desc" && orderByColumn === "club_name"
              ? styles.active
              : styles.item
          }
        >
          {t("sortClubNameDesc")}
        </p>
        <p
          onClick={() => handleOrderBy("location_id", "asc")}
          className={
            orderByDirection === "asc" && orderByColumn === "location_id"
              ? styles.active
              : styles.item
          }
        >
          {t("locationAsc")}
        </p>
        <p
          onClick={() => handleOrderBy("location_id", "desc")}
          className={
            orderByDirection === "desc" && orderByColumn === "location_id"
              ? styles.active
              : styles.item
          }
        >
          {t("locationDesc")}
        </p>
        <div className={styles["buttons-container"]}>
          <button
            onClick={handleClearOrderBy}
            className={styles["discard-button"]}
          >
            {t("clearButtonText")}
          </button>
          <button
            onClick={handleCloseSortModal}
            className={styles["submit-button"]}
          >
            {t("applyButtonText")}
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default ExploreCourtsSortModal;
