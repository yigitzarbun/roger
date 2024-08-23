import React from "react";
import ReactModal from "react-modal";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";

interface MatchSorttProps {
  matchSortModalOpen: boolean;
  handleCloseMatchSortModal: () => void;
  handleOrderBy: (e: string, f: string) => void;
  handleClearOrderBy: () => void;
  orderByDirection: string;
  orderByColumn: string;
}

const MatchSort = (props: MatchSorttProps) => {
  const {
    matchSortModalOpen,
    handleCloseMatchSortModal,
    handleOrderBy,
    handleClearOrderBy,
    orderByDirection,
    orderByColumn,
  } = props;
  const { t } = useTranslation();

  return (
    <ReactModal
      isOpen={matchSortModalOpen}
      onRequestClose={handleCloseMatchSortModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={handleCloseMatchSortModal} />
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
            onClick={handleCloseMatchSortModal}
            className={styles["submit-button"]}
          >
            {t("applyButtonText")}
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default MatchSort;
