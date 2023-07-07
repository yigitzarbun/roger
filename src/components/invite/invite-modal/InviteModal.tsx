import Modal from "react-modal";

import styles from "./styles.module.scss";

import { FormValues } from "../lesson/form/LessonInviteForm";

Modal.setAppElement("#root");

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
          {formData?.event_type === "lesson"
            ? "Ders"
            : formData?.event_type === "match"
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
            <th>{formData?.event_type === "lesson" ? "Eğitmen" : "Oyuncu"}</th>
            <th>İsim</th>
            <th>Tarih</th>
            <th>Saat</th>
            <th>Konum</th>
            <th>Kort</th>
            <th>Kort Ücreti (TL)</th>
            {formData?.event_type === "lesson" && <th>Ders Ücreti (TL)</th>}
            <th>Toplam Tutar (TL)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <img src={formData?.image} />
            </td>
            <td>{`${formData?.fname} ${formData?.lname}`}</td>
            <td>{formData?.event_date}</td>
            <td>{formData?.event_time}</td>
            <td>{formData?.location}</td>
            <td>{formData?.court_name}</td>
            <td>{formData?.court_price}</td>
            {formData?.event_type === "lesson" && (
              <td>{formData?.lesson_price}</td>
            )}
            <td className={styles["total-sum-text"]}>
              {Number(formData?.court_price) + Number(formData?.lesson_price)}
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={handleModalSubmit}>Davet gönder</button>
    </Modal>
  );
};

export default InviteModal;
