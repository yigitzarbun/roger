import React from "react";
import styles from "./styles.module.scss";

interface LessonInviteConfirmationProps {
  handleCloseConfirmation: () => void;
  handleModalSubmit: () => void;
  selectedClubName: string;
  selectedCourtName: string;
  selectedCourtPrice: number;
  selectedTrainerPrice: number;
  selectedTime: string;
  selectedDate: string;
  isUserPlayer: boolean;
  isUserTrainer: boolean;
}
const LessonInviteConfirmation = (props: LessonInviteConfirmationProps) => {
  const {
    handleCloseConfirmation,
    handleModalSubmit,
    selectedClubName,
    selectedCourtName,
    selectedCourtPrice,
    selectedTrainerPrice,
    selectedDate,
    selectedTime,
    isUserPlayer,
    isUserTrainer,
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
            <td>
              {isUserPlayer
                ? selectedCourtPrice + selectedTrainerPrice
                : isUserTrainer
                ? selectedTrainerPrice
                : null}{" "}
              TL
            </td>
          </tr>
        </tbody>
      </table>
      {isUserPlayer && (
        <p className={styles["information-text"]}>
          Ücret bilgisi kort ve ders ücreti dahil fiyattır.
        </p>
      )}
      {isUserTrainer && (
        <p className={styles["information-text"]}>
          Ücret bilgisi ders ücretini ifade eder. Tüm masraflar oyuncuya aittir.
        </p>
      )}
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

export default LessonInviteConfirmation;
