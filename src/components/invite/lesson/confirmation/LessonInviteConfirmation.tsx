import React from "react";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();

  return (
    <div className={styles["confirmation-container"]}>
      <table>
        <thead>
          <tr>
            <th>{t("tableDateHeader")}</th>
            <th>{t("tableTimeHeader")}</th>
            <th>{t("tableClubHeader")}</th>
            <th>{t("tableCourtHeader")}</th>
            <th>{t("tablePriceHeader")}</th>
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
          <p>* {t("playerFeeText")}</p>
        </p>
      )}
      {isUserTrainer && (
        <p className={styles["information-text"]}>
          {t("lessonInviteTrainerFeeText")}
        </p>
      )}
      <div className={styles["buttons-container"]}>
        <button
          onClick={handleCloseConfirmation}
          className={styles["discard-button"]}
        >
          {t("discardButtonText")}
        </button>
        <button onClick={handleModalSubmit} className={styles["submit-button"]}>
          {t("sendRequestButtonText")}
        </button>
      </div>
    </div>
  );
};

export default LessonInviteConfirmation;
