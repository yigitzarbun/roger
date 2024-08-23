import React from "react";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

interface MatchInviteConfirmationProps {
  handleCloseConfirmation: () => void;
  handleModalSubmit: () => void;
  selectedClubName: string;
  selectedCourtName: string;
  selectedCourtPrice: number;
  selectedTime: string;
  selectedDate: string;
}
const MatchInviteConfirmation = (props: MatchInviteConfirmationProps) => {
  const {
    handleCloseConfirmation,
    handleModalSubmit,
    selectedClubName,
    selectedCourtName,
    selectedCourtPrice,
    selectedDate,
    selectedTime,
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
            <td>{selectedCourtPrice / 2}</td>
          </tr>
        </tbody>
      </table>
      <p>
        <p>* {t("playerFeeText")}</p>
      </p>
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

export default MatchInviteConfirmation;
