import React from "react";
import ReactModal from "react-modal";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";

interface ExploreClubsSortModalProps {
  sortModalOpen: boolean;
  handleCloseSortModal: () => void;
  handleOrderBy: (e: string, f: string) => void;
  handleClearOrderBy: () => void;
  orderByDirection: string;
  orderByColumn: string;
}

const ExploreClubsSortModal = (props: ExploreClubsSortModalProps) => {
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
        <h3>Kulüpleri Sırala</h3>
        <div className={styles["outer-container"]}>
          <p
            onClick={() => handleOrderBy("club_name", "asc")}
            className={
              orderByDirection === "asc" && orderByColumn === "club_name"
                ? styles.active
                : styles.item
            }
          >
            {t("nameAsc")}
          </p>
          <p
            onClick={() => handleOrderBy("club_name", "desc")}
            className={
              orderByDirection === "desc" && orderByColumn === "club_name"
                ? styles.active
                : styles.item
            }
          >
            {t("nameDesc")}
          </p>
        </div>
        <div className={styles["outer-container"]}>
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
        </div>
        <div className={styles["outer-container"]}>
          <p
            onClick={() => handleOrderBy("courtQuantity", "asc")}
            className={
              orderByDirection === "asc" && orderByColumn === "courtQuantity"
                ? styles.active
                : styles.item
            }
          >
            {t("courtNumberAsc")}
          </p>
          <p
            onClick={() => handleOrderBy("courtQuantity", "desc")}
            className={
              orderByDirection === "desc" && orderByColumn === "courtQuantity"
                ? styles.active
                : styles.item
            }
          >
            {t("courtNumberDesc")}
          </p>
        </div>
        <div className={styles["outer-container"]}>
          <p
            onClick={() => handleOrderBy("staffQuantity", "asc")}
            className={
              orderByDirection === "asc" && orderByColumn === "staffQuantity"
                ? styles.active
                : styles.item
            }
          >
            {t("trainerNumberAsc")}
          </p>
          <p
            onClick={() => handleOrderBy("staffQuantity", "desc")}
            className={
              orderByDirection === "desc" && orderByColumn === "staffQuantity"
                ? styles.active
                : styles.item
            }
          >
            {t("trainerNumberDesc")}
          </p>
        </div>
        <div className={styles["outer-container"]}>
          <p
            onClick={() => handleOrderBy("memberQuantity", "asc")}
            className={
              orderByDirection === "asc" && orderByColumn === "memberQuantity"
                ? styles.active
                : styles.item
            }
          >
            {t("subscriberNumberAsc")}
          </p>
          <p
            onClick={() => handleOrderBy("memberQuantity", "desc")}
            className={
              orderByDirection === "desc" && orderByColumn === "memberQuantity"
                ? styles.active
                : styles.item
            }
          >
            {t("subscriberNumberDesc")}
          </p>
        </div>
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

export default ExploreClubsSortModal;
