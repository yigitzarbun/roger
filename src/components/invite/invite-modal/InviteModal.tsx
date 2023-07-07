import Modal from "react-modal";

import styles from "./styles.module.scss";

import { FormValues } from "../lesson/form/LessonInviteForm";

Modal.setAppElement("#root");

interface ModalProps {
  modal: boolean;
  handleModalSubmit: () => void;
  formData?: FormValues | null | undefined;
}

const InviteModal = ({ modal, handleModalSubmit, formData }: ModalProps) => {
  return (
    <Modal isOpen={modal} className={styles["modal-container"]}>
      <h1>{formData?.event_type}</h1>
      <table>
        <thead>
          <tr>
            <th>{formData?.event_type === "Lesson" ? "Eğitmen" : "Oyuncu"}</th>
            <th>Tarih</th>
            <th>Saat</th>
            <th>Konum</th>
            <th>Kort</th>
            <th>Kort Ücreti</th>
            <th>Ders Ücreti</th>
            <th>Toplam Tutar</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>{`${formData?.fname} ${formData?.lname}`}</th>
            <th>{formData?.event_date}</th>
            <th>{formData?.event_time}</th>
            <th>{formData?.location}</th>
            <th>{formData?.court_name}</th>
            <th>{formData?.court_price}</th>
            <th>{formData?.lesson_price}</th>
            <th>
              {Number(formData?.court_price) + Number(formData?.lesson_price)}
            </th>
          </tr>
        </tbody>
      </table>
      <p>Do you confirm?</p>

      <button onClick={handleModalSubmit}>Submit</button>
    </Modal>
  );
};

export default InviteModal;
