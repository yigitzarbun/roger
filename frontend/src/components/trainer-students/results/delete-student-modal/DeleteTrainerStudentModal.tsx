import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { useUpdateStudentMutation } from "../../../../../api/endpoints/StudentsApi";

interface DeleteTrainerStudentModalProps {
  deleteModalOpen: boolean;
  closeDeleteModal: () => void;
  student: any;
  refetchStudents: () => void;
}

const DeleteTrainerStudentModal = (props: DeleteTrainerStudentModalProps) => {
  const { deleteModalOpen, closeDeleteModal, student, refetchStudents } = props;

  const { t } = useTranslation();

  const [updateStudent, { isSuccess: isUpdateStudentSuccess }] =
    useUpdateStudentMutation({});

  const handleDeleteStudent = () => {
    const updatedStudentData = {
      student_id: student?.student_id,
      registered_at: student?.registered_at,
      trainer_id: student?.trainer_id,
      player_id: student?.playerUserId,
      student_status: "declined",
    };
    updateStudent(updatedStudentData);
  };

  useEffect(() => {
    if (isUpdateStudentSuccess) {
      refetchStudents();
      toast.success("Öğrenci silindi");
      closeDeleteModal();
    }
  }, [isUpdateStudentSuccess]);

  return (
    <ReactModal
      isOpen={deleteModalOpen}
      onRequestClose={closeDeleteModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeDeleteModal} />
      <div className={styles["modal-content"]}>
        <h1 className={styles.title}>{t("deleteStudent")}</h1>
        <div className={styles["bottom-container"]}>
          <img
            src={
              student?.playerImage
                ? student?.playerImage
                : "/images/icons/avatar.jpg"
            }
            alt="request"
            className={styles["trainer-image"]}
          />
          <p>{`${student?.playerFname} ${student?.playerLname} ${t(
            "deleteStudentText"
          )}`}</p>
        </div>
        <div className={styles["buttons-container"]}>
          <button
            onClick={closeDeleteModal}
            className={styles["discard-button"]}
          >
            {t("discardButtonText")}
          </button>
          <button
            onClick={handleDeleteStudent}
            className={styles["submit-button"]}
          >
            {t("confirm")}
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default DeleteTrainerStudentModal;
