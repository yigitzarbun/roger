import React from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { localUrl } from "../../../common/constants/apiConstants";

interface StudentApplicationModalProps {
  studentApplicationModalOpen: boolean;
  handleCloseStudentApplicationModal: () => void;
  trainerName: string;
  handleAddStudent: () => any;
  trainerImage: string;
}

const StudentApplicationModal = (props: StudentApplicationModalProps) => {
  const {
    studentApplicationModalOpen,
    handleCloseStudentApplicationModal,
    trainerName,
    handleAddStudent,
    trainerImage,
  } = props;
  return (
    <ReactModal
      isOpen={studentApplicationModalOpen}
      onRequestClose={handleCloseStudentApplicationModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div
        className={styles["overlay"]}
        onClick={handleCloseStudentApplicationModal}
      />
      <div className={styles["modal-content"]}>
        <h3>Öğrencilik Başvurusu</h3>
        <div className={styles["image-container"]}>
          <img
            src={
              trainerImage
                ? `${localUrl}/${trainerImage}`
                : "/images/icons/avatar.jpg"
            }
          />
          <p>{`${trainerName} isimli eğitmene öğrencilik başvurusu yapmayı onaylıyor musunuz?`}</p>
        </div>

        <div className={styles["buttons-container"]}>
          <button
            onClick={handleCloseStudentApplicationModal}
            className={styles["discard-button"]}
          >
            Vazgeç
          </button>
          <button
            onClick={handleAddStudent}
            className={styles["submit-button"]}
          >
            Gönder
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default StudentApplicationModal;
