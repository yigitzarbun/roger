import React from "react";
import ReactModal from "react-modal";

import styles from "./styles.module.scss";

interface TrainSortProps {
  trainSortModalOpen: boolean;
  handleCloseTrainSortModal: () => void;
  handleOrderBy: (e: string, f: string) => void;
  handleClearOrderBy: () => void;
  orderByDirection: string;
  orderByColumn: string;
}

const TrainSort = (props: TrainSortProps) => {
  const {
    trainSortModalOpen,
    handleCloseTrainSortModal,
    handleOrderBy,
    handleClearOrderBy,
    orderByDirection,
    orderByColumn,
  } = props;
  return (
    <ReactModal
      isOpen={trainSortModalOpen}
      onRequestClose={handleCloseTrainSortModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={handleCloseTrainSortModal} />
      <div className={styles["modal-content"]}>
        <h3>Oyuncuları Sırala</h3>
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
          onClick={() => handleOrderBy("player_level_id", "asc")}
          className={
            orderByDirection === "asc" && orderByColumn === "player_level_id"
              ? styles.active
              : styles.item
          }
        >
          Oyuncu Seviyesi Yükselen
        </p>
        <p
          onClick={() => handleOrderBy("player_level_id", "desc")}
          className={
            orderByDirection === "desc" && orderByColumn === "player_level_id"
              ? styles.active
              : styles.item
          }
        >
          Oyuncu Seviyesi Azalan
        </p>
        <div className={styles["buttons-container"]}>
          <button
            onClick={handleClearOrderBy}
            className={styles["discard-button"]}
          >
            Temizle
          </button>
          <button
            onClick={handleCloseTrainSortModal}
            className={styles["submit-button"]}
          >
            Uygula
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default TrainSort;
