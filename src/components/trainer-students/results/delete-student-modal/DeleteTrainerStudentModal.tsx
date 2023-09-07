import React, { useEffect } from "react";

import Modal from "react-modal";

import { FaWindowClose } from "react-icons/fa";

import styles from "./styles.module.scss";

import {
  Student,
  useGetStudentsQuery,
  useUpdateStudentMutation,
} from "../../../../api/endpoints/StudentsApi";
import { Player } from "../../../../api/endpoints/PlayersApi";

interface DeleteTrainerStudentModalProps {
  deleteModalOpen: boolean;
  closeDeleteModal: () => void;
  deleteStudentId: number;
  trainerUserId: number;
  students: Student[];
  players: Player[];
}

const DeleteTrainerStudentModal = (props: DeleteTrainerStudentModalProps) => {
  const {
    deleteModalOpen,
    closeDeleteModal,
    deleteStudentId,
    trainerUserId,
    students,
    players,
  } = props;

  const [updateStudent, { isSuccess: isUpdateStudentSuccess }] =
    useUpdateStudentMutation({});

  const { refetch } = useGetStudentsQuery({});

  const selectedStudent = players?.find(
    (player) =>
      player.user_id ===
      students?.find((student) => student.student_id === deleteStudentId)
        ?.player_id
  );

  const handleDeleteStudent = () => {
    const selectedStudentData = students?.find(
      (student) =>
        student.student_id === deleteStudentId &&
        student.trainer_id === trainerUserId &&
        student.student_status === "accepted"
    );
    const updatedStudentData = {
      ...selectedStudentData,
      student_status: "declined",
    };
    updateStudent(updatedStudentData);
  };

  useEffect(() => {
    if (isUpdateStudentSuccess) {
      refetch();
      closeDeleteModal();
    }
  }, [isUpdateStudentSuccess]);
  return (
    <Modal
      isOpen={deleteModalOpen}
      onRequestClose={closeDeleteModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1 className={styles.title}>Öğrenciyi sil</h1>
        <FaWindowClose
          onClick={closeDeleteModal}
          className={styles["close-icon"]}
        />
      </div>
      <div className={styles["bottom-container"]}>
        <img
          src={
            selectedStudent?.image
              ? selectedStudent?.image
              : "images/icons/avatar.png"
          }
          className={styles["trainer-image"]}
        />
        <h4>{`${selectedStudent?.fname} ${selectedStudent?.lname} isimli oyuncuyu öğrencilikten çıkarmayı onaylıyor musunuz?`}</h4>
      </div>
      <button onClick={handleDeleteStudent} className={styles["button"]}>
        Onayla
      </button>
    </Modal>
  );
};

export default DeleteTrainerStudentModal;
