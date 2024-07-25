import React from "react";
import ReactModal from "react-modal";

import styles from "./styles.module.scss";

interface LessonSortModalProps {
  sortModalOpen: boolean;
  handleCloseSortModal: () => void;
  handleOrderBy: (e: string, f: string) => void;
  handleClearOrderBy: () => void;
  orderByDirection: string;
  orderByColumn: string;
}

const LessonSortModal = (props: LessonSortModalProps) => {
  const {
    sortModalOpen,
    handleCloseSortModal,
    handleOrderBy,
    handleClearOrderBy,
    orderByDirection,
    orderByColumn,
  } = props;
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
        <h3>Eğitmenleri Sırala</h3>
        <p
          onClick={() => handleOrderBy("lname", "asc")}
          className={
            orderByDirection === "asc" && orderByColumn === "lname"
              ? styles.active
              : styles.item
          }
        >
          İsim A'dan Z'ye
        </p>
        <p
          onClick={() => handleOrderBy("lname", "desc")}
          className={
            orderByDirection === "desc" && orderByColumn === "lname"
              ? styles.active
              : styles.item
          }
        >
          İsim Z'den A'ya
        </p>
        <p
          onClick={() => handleOrderBy("location_id", "asc")}
          className={
            orderByDirection === "asc" && orderByColumn === "location_id"
              ? styles.active
              : styles.item
          }
        >
          Konum A'dan Z'ye
        </p>
        <p
          onClick={() => handleOrderBy("location_id", "desc")}
          className={
            orderByDirection === "desc" && orderByColumn === "location_id"
              ? styles.active
              : styles.item
          }
        >
          Konum Z'den A'ya
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
          Eğitmen Deneyim Seviyesi Yükselen
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
          Eğitmen Deneyim Seviyesi Azalan
        </p>
        <div className={styles["buttons-container"]}>
          <button
            onClick={handleClearOrderBy}
            className={styles["discard-button"]}
          >
            Temizle
          </button>
          <button
            onClick={handleCloseSortModal}
            className={styles["submit-button"]}
          >
            Uygula
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default LessonSortModal;
