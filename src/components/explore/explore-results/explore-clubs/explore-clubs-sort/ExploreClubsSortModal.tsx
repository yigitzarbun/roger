import React from "react";
import ReactModal from "react-modal";

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
            İsim A'dan Z'ye
          </p>
          <p
            onClick={() => handleOrderBy("club_name", "desc")}
            className={
              orderByDirection === "desc" && orderByColumn === "club_name"
                ? styles.active
                : styles.item
            }
          >
            İsim Z'den A'ya
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
            Kort Sayısı Yükselen
          </p>
          <p
            onClick={() => handleOrderBy("courtQuantity", "desc")}
            className={
              orderByDirection === "desc" && orderByColumn === "courtQuantity"
                ? styles.active
                : styles.item
            }
          >
            Kort Sayısı Azalan
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
            Eğitmen Sayısı Yükselen
          </p>
          <p
            onClick={() => handleOrderBy("staffQuantity", "desc")}
            className={
              orderByDirection === "desc" && orderByColumn === "staffQuantity"
                ? styles.active
                : styles.item
            }
          >
            Eğitmen Sayısı Azalan
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
            Üye Sayısı Yükselen
          </p>
          <p
            onClick={() => handleOrderBy("memberQuantity", "desc")}
            className={
              orderByDirection === "desc" && orderByColumn === "memberQuantity"
                ? styles.active
                : styles.item
            }
          >
            Üye Sayısı Azalan
          </p>
        </div>
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

export default ExploreClubsSortModal;
