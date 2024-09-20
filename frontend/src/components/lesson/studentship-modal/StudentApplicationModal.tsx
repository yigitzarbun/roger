import React from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { imageUrl } from "../../../common/constants/apiConstants";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();

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
        <h3>{t("studentApplicationTitle")}</h3>
        <div className={styles["image-container"]}>
          <img
            src={
              trainerImage
                ? `${imageUrl}/${trainerImage}`
                : "/images/icons/avatar.jpg"
            }
          />
          <p>{`${t("studentApplicationText")} ${trainerName}`}</p>
        </div>

        <div className={styles["buttons-container"]}>
          <button
            onClick={handleCloseStudentApplicationModal}
            className={styles["discard-button"]}
          >
            {t("discardButtonText")}
          </button>
          <button
            onClick={handleAddStudent}
            className={styles["submit-button"]}
          >
            {t("confirm")}
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default StudentApplicationModal;
