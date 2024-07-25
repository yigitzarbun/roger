import React from "react";
import ReactModal from "react-modal";

import styles from "./styles.module.scss";

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
        <h3>Kortları Sırala</h3>
        <p
          onClick={() => handleOrderBy("court_name", "asc")}
          className={
            orderByDirection === "asc" && orderByColumn === "court_name"
              ? styles.active
              : styles.item
          }
        >
          Kort Adı A'dan Z'ye
        </p>
        <p
          onClick={() => handleOrderBy("court_name", "desc")}
          className={
            orderByDirection === "desc" && orderByColumn === "court_name"
              ? styles.active
              : styles.item
          }
        >
          Kort Adı Z'den A'ya
        </p>
        <p
          onClick={() => handleOrderBy("club_name", "asc")}
          className={
            orderByDirection === "asc" && orderByColumn === "club_name"
              ? styles.active
              : styles.item
          }
        >
          Kulüp Adı A'dan Z'ye
        </p>
        <p
          onClick={() => handleOrderBy("club_name", "desc")}
          className={
            orderByDirection === "desc" && orderByColumn === "club_name"
              ? styles.active
              : styles.item
          }
        >
          Kulüp Adı Z'den A'ya
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

export default ExploreCourtsSortModal;
