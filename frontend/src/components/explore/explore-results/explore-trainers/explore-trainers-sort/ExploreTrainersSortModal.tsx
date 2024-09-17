import React from "react";
import ReactModal from "react-modal";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";

interface ExploreTrainersSortModalProps {
  sortModalOpen: boolean;
  handleCloseSortModal: () => void;
  handleOrderBy: (e: string, f: string) => void;
  handleClearOrderBy: () => void;
  orderByDirection: string;
  orderByColumn: string;
}

const ExploreTrainersSortModal = (props: ExploreTrainersSortModalProps) => {
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
        <h3>{t("sortTrainersTitle")}</h3>
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
          onClick={() => handleOrderBy("trainer_experience_type_id", "asc")}
          className={
            orderByDirection === "asc" &&
            orderByColumn === "trainer_experience_type_id"
              ? styles.active
              : styles.item
          }
        >
          {t("trainerLevelAsc")}
        </p>
        <p
          onClick={() => handleOrderBy("trainer_experience_type_id", "desc")}
          className={
            orderByDirection === "desc" &&
            orderByColumn === "trainer_experience_type_id"
              ? styles.active
              : styles.item
          }
        >
          {t("trainerLevelDesc")}
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

export default ExploreTrainersSortModal;
