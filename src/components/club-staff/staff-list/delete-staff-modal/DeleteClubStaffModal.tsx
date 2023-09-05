import React, { useEffect } from "react";

import Modal from "react-modal";

import { FaWindowClose } from "react-icons/fa";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";

import {
  useGetClubStaffQuery,
  useUpdateClubStaffMutation,
} from "../../../../api/endpoints/ClubStaffApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";

interface DeleteClubStaffModalProps {
  isDeleteStaffModalOpen: boolean;
  closeDeleteStaffModal: () => void;
  selectedStaffUserId: number;
}

const DeleteClubStaffModal = (props: DeleteClubStaffModalProps) => {
  const { isDeleteStaffModalOpen, closeDeleteStaffModal, selectedStaffUserId } =
    props;

  const {
    data: clubStaff,
    isLoading: isClubStaffLoading,
    refetch: refetchStaff,
  } = useGetClubStaffQuery({});

  const selectedClubStaff = clubStaff?.find(
    (staff) => staff.user_id === selectedStaffUserId
  );

  const {
    data: trainers,
    isLoading: isTrainersLoading,
    refetch: refetchTrainers,
  } = useGetTrainersQuery({});

  const [updateClubStaff, { isSuccess: isUpdateStaffSuccess }] =
    useUpdateClubStaffMutation({});

  const handleDeleteStaff = () => {
    const updatedStaffData = {
      ...selectedClubStaff,
      employment_status: "terminated_by_club",
    };
    updateClubStaff(updatedStaffData);
  };

  useEffect(() => {
    if (isUpdateStaffSuccess) {
      refetchStaff();
      refetchTrainers();
      closeDeleteStaffModal();
    }
  }, [isUpdateStaffSuccess]);

  if (isTrainersLoading || isClubStaffLoading) {
    return <PageLoading />;
  }

  return (
    <Modal
      isOpen={isDeleteStaffModalOpen}
      onRequestClose={closeDeleteStaffModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1 className={styles.title}>Personeli Sil</h1>
        <FaWindowClose
          onClick={closeDeleteStaffModal}
          className={styles["close-icon"]}
        />
      </div>
      <div className={styles["bottom-container"]}>
        <img
          src={
            trainers?.find((trainer) => trainer.user_id === selectedStaffUserId)
              ?.image
              ? trainers?.find(
                  (trainer) => trainer.user_id === selectedStaffUserId
                )?.image
              : "images/icons/avatar.png"
          }
          className={styles["trainer-image"]}
        />
        <h4>{`${selectedClubStaff?.fname} ${selectedClubStaff?.lname} isimli eğitmeni kulüp çalışanlarınız arasından çıkarmak istediğinize emin misiniz?`}</h4>
      </div>
      <button onClick={handleDeleteStaff} className={styles["button"]}>
        Personeli Sil
      </button>
    </Modal>
  );
};

export default DeleteClubStaffModal;
