import Modal from "react-modal";
import React from "react";

import styles from "./styles.module.scss";

export type FormValues = {
  event_type_id: number;
  event_date: string;
  event_time: string;
  booking_status_type_id: number;
  club_id: number;
  court_id: number;
  court_price: number;
  lesson_price: number | null;
};

interface ModalProps {
  modal: boolean;
  handleModalSubmit: () => void;
  formData?: FormValues | null | undefined;
  handleCloseModal: () => void;
}

const InviteModal = ({
  modal,
  handleModalSubmit,
  formData,
  handleCloseModal,
}: ModalProps) => {
  return (
    <Modal isOpen={modal} className={styles["modal-container"]}>
      <div className={styles["top-container"]}>
        <h1>
          {formData?.event_type_id === 3
            ? "Ders"
            : formData?.event_type_id === 2
            ? "Maç"
            : "Antreman"}
        </h1>
        <img
          src="/images/icons/close.png"
          onClick={handleCloseModal}
          className={styles["close-button"]}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>{formData?.event_type_id === 3 ? "Eğitmen" : "Oyuncu"}</th>
            <th>İsim</th>
            <th>Tarih</th>
            <th>Saat</th>
            <th>Konum</th>
            <th>Kort</th>
            <th>Kort Ücreti (TL)</th>
            {formData?.event_type_id === 3 && <th>Ders Ücreti (TL)</th>}
            <th>Toplam Tutar (TL)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <img />
            </td>
            <td>isim</td>
            <td>{formData?.event_date}</td>
            <td>{formData?.event_time}</td>
            <td>{formData?.club_id}</td>
            <td>{formData?.court_id}</td>
            <td>{formData?.court_price}</td>
            {formData?.event_type_id === 3 && <td>{formData?.lesson_price}</td>}
            {formData?.event_type_id === 3 ? (
              <td className={styles["total-sum-text"]}>
                {Number(formData?.court_price) + Number(formData?.lesson_price)}
              </td>
            ) : (
              <td className={styles["total-sum-text"]}>
                {Number(formData?.court_price)}
              </td>
            )}
          </tr>
        </tbody>
      </table>
      <button onClick={handleModalSubmit}>Davet gönder</button>
    </Modal>
  );
};

export default InviteModal;
