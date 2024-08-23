import React from "react";
import ReactModal from "react-modal";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";

interface ExplorePlayersSortModalProps {
  sortModalOpen: boolean;
  handleCloseSortModal: () => void;
  handleOrderBy: (e: string, f: string) => void;
  handleClearOrderBy: () => void;
  orderByDirection: string;
  orderByColumn: string;
}

const ExplorePlayersSortModal = (props: ExplorePlayersSortModalProps) => {
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
        <h3>{t("sortPlayersTitle")}</h3>
        <p
          onClick={() => handleOrderBy("lname", "asc")}
          className={
            orderByDirection === "asc" && orderByColumn === "lname"
              ? styles.active
              : styles.item
          }
        >
          {t("nameAsc")}
        </p>
        <p
          onClick={() => handleOrderBy("lname", "desc")}
          className={
            orderByDirection === "desc" && orderByColumn === "lname"
              ? styles.active
              : styles.item
          }
        >
          {t("nameDesc")}
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
        <p
          onClick={() => handleOrderBy("player_level_id", "asc")}
          className={
            orderByDirection === "asc" && orderByColumn === "player_level_id"
              ? styles.active
              : styles.item
          }
        >
          {t("playerLevelAsc")}
        </p>
        <p
          onClick={() => handleOrderBy("player_level_id", "desc")}
          className={
            orderByDirection === "desc" && orderByColumn === "player_level_id"
              ? styles.active
              : styles.item
          }
        >
          {t("playerLevelDesc")}
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

export default ExplorePlayersSortModal;
