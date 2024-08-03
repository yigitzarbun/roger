import React from "react";
import styles from "./styles.module.scss";

interface TrainingInviteConfirmationProps {
  handleCloseConfirmation: () => void;
  handleModalSubmit: () => void;
  selectedClubName: string;
  selectedCourtName: string;
  selectedCourtPrice: number;
  selectedTime: string;
  selectedDate: string;
}
const TrainingInviteConfirmation = (props: TrainingInviteConfirmationProps) => {
  const {
    handleCloseConfirmation,
    handleModalSubmit,
    selectedClubName,
    selectedCourtName,
    selectedCourtPrice,
    selectedDate,
    selectedTime,
  } = props;
  return (
    <div className={styles["confirmation-container"]}>
      <table>
        <thead>
          <tr>
            <th>Tarih</th>
            <th>Saat</th>
            <th>Kulüp</th>
            <th>Kort</th>
            <th>Ücret</th>
          </tr>
        </thead>
        <tbody>
          <tr className={styles["player-row"]}>
            <td>{selectedDate}</td>
            <td>{selectedTime}</td>
            <td>{selectedClubName}</td>
            <td>{selectedCourtName}</td>
            <td>{selectedCourtPrice / 2} TL</td>
          </tr>
        </tbody>
      </table>
      <p>
        Toplam kort ücreti <span>{selectedCourtPrice}</span> TL'dir. Bu tutar
        oyuncular arasında eşit bölünerek tahsil edilecektir.
      </p>
      <div className={styles["buttons-container"]}>
        <button
          onClick={handleCloseConfirmation}
          className={styles["discard-button"]}
        >
          İptal
        </button>
        <button onClick={handleModalSubmit} className={styles["submit-button"]}>
          Onayla
        </button>
      </div>
    </div>
  );
};

export default TrainingInviteConfirmation;
