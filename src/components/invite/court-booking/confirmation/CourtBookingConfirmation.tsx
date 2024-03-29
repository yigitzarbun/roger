import React from "react";
import styles from "./styles.module.scss";
import { localUrl } from "../../../../common/constants/apiConstants";

interface CourtBookingConfirmationProps {
  handleCloseConfirmation: () => void;
  handleModalSubmit: () => void;
  eventType: string;
  selectedCourtPrice: number;
  invitee: any;
}
const CourtBookingConfirmation = (props: CourtBookingConfirmationProps) => {
  const {
    handleCloseConfirmation,
    handleModalSubmit,
    eventType,
    selectedCourtPrice,
    invitee,
  } = props;

  return (
    <div className={styles["confirmation-container"]}>
      <div className={styles["table-container"]}>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Oyuncu</th>
              <th>Tür</th>
              <th>Ücret</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.row}>
              <td>
                <img
                  src={
                    invitee?.[0]?.image
                      ? `${localUrl}/${invitee?.[0]?.image}`
                      : "/images/icons/avatar.jpg"
                  }
                  className={styles.image}
                />
              </td>
              <td>{`${invitee?.[0]?.fname} ${invitee?.[0]?.lname}`}</td>
              <td>{eventType}</td>
              <td>{selectedCourtPrice / 2} TL</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={styles.pricing}>
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
export default CourtBookingConfirmation;
