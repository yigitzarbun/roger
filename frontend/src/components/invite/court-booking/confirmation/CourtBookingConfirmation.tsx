import React from "react";
import styles from "./styles.module.scss";
import { imageUrl } from "../../../../common/constants/apiConstants";
import { useTranslation } from "react-i18next";

interface CourtBookingConfirmationProps {
  handleCloseConfirmation: () => void;
  handleModalSubmit: () => void;
  eventTypeId: number;
  selectedCourtPrice: number;
  lessonPrice: number;
  invitee: any;
  isUserPlayer: boolean;
  isUserTrainer: boolean;
  isButtonDisabled: boolean;
  buttonText: string;
}
const CourtBookingConfirmation = (props: CourtBookingConfirmationProps) => {
  const {
    handleCloseConfirmation,
    handleModalSubmit,
    eventTypeId,
    selectedCourtPrice,
    invitee,
    lessonPrice,
    isUserTrainer,
    isUserPlayer,
    isButtonDisabled,
    buttonText,
  } = props;

  const { t } = useTranslation();

  return (
    <div className={styles["confirmation-container"]}>
      <div className={styles["table-container"]}>
        <table>
          <thead>
            <tr>
              <th>
                {eventTypeId === 3 ? t("userTypeTrainer") : t("userTypePlayer")}
              </th>
              <th>{t("tableNameHeader")}</th>
              <th>{t("tableClubTypeHeader")}</th>
              <th>{t("tablePriceHeader")}</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.row}>
              <td>
                <img
                  src={
                    invitee?.[0]?.image
                      ? `${imageUrl}/${invitee?.[0]?.image}`
                      : "/images/icons/avatar.jpg"
                  }
                  className={styles.image}
                />
              </td>
              <td>{`${invitee?.[0]?.fname} ${invitee?.[0]?.lname}`}</td>
              <td>
                {eventTypeId === 1
                  ? t("training")
                  : eventTypeId === 2
                  ? t("match")
                  : eventTypeId === 3
                  ? t("lesson")
                  : eventTypeId === 4
                  ? t("externalTraining")
                  : eventTypeId === 5
                  ? t("externalLesson")
                  : eventTypeId === 6
                  ? t("groupLesson")
                  : eventTypeId === 7
                  ? t("tournamentMatch")
                  : ""}
              </td>
              <td>
                {isUserPlayer && (eventTypeId === 2 || eventTypeId === 1)
                  ? selectedCourtPrice / 2
                  : isUserPlayer && eventTypeId === 3
                  ? selectedCourtPrice + lessonPrice
                  : isUserTrainer && eventTypeId === 3
                  ? lessonPrice
                  : ""}{" "}
                TL
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {isUserPlayer && (eventTypeId === 2 || eventTypeId === 1) && (
        <p className={styles.pricing}>{t("playerFeeText")}</p>
      )}
      <div className={styles["buttons-container"]}>
        <button
          onClick={handleCloseConfirmation}
          className={styles["discard-button"]}
        >
          {t("cancel")}
        </button>
        <button
          onClick={handleModalSubmit}
          className={styles["submit-button"]}
          disabled={isButtonDisabled}
        >
          {t("sendRequestButtonText")}
        </button>
      </div>
      {isButtonDisabled && <p className={styles.validation}>{buttonText}</p>}
    </div>
  );
};
export default CourtBookingConfirmation;
