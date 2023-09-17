import React, { useEffect } from "react";

import Modal from "react-modal";

import { toast } from "react-toastify";

import { FaWindowClose } from "react-icons/fa";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";

import {
  useGetClubStaffByFilterQuery,
  useGetClubStaffQuery,
  useUpdateClubStaffMutation,
} from "../../../../api/endpoints/ClubStaffApi";
import { useGetTrainersByFilterQuery } from "../../../../api/endpoints/TrainersApi";
import { useAppSelector } from "../../../../store/hooks";

interface DeleteClubStaffModalProps {
  isDeleteStaffModalOpen: boolean;
  closeDeleteStaffModal: () => void;
  selectedClubStaffUserId: number;
}

const DeleteClubStaffModal = (props: DeleteClubStaffModalProps) => {
  const user = useAppSelector((store) => store?.user?.user);

  const {
    isDeleteStaffModalOpen,
    closeDeleteStaffModal,
    selectedClubStaffUserId,
  } = props;

  const {
    data: selectedClubStaff,
    isLoading: isSelectedClubStaffLoading,
    refetch: refetchClubStaff,
  } = useGetClubStaffByFilterQuery({
    user_id: selectedClubStaffUserId,
  });

  const { data: selectedTrainer, isLoading: isSelectedTrainerLoading } =
    useGetTrainersByFilterQuery({
      user_id: selectedClubStaffUserId,
    });
  const selectedTrainerImage = selectedTrainer?.[0]?.["image"];

  const [updateClubStaff, { isSuccess }] = useUpdateClubStaffMutation({});

  const handleDeleteStaff = () => {
    const updatedStaffData = {
      ...selectedClubStaff?.[0],
      employment_status: "terminated_by_club",
    };
    updateClubStaff(updatedStaffData);
  };

  useEffect(() => {
    if (isSuccess) {
      refetchClubStaff();
      toast.success("Personel silindi");
      closeDeleteStaffModal();
    }
  }, [isSuccess]);

  if (isSelectedClubStaffLoading || isSelectedTrainerLoading) {
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
            selectedTrainerImage
              ? selectedTrainerImage
              : "images/icons/avatar.png"
          }
          className={styles["trainer-image"]}
        />
        <h4>{`${selectedTrainer?.[0]?.["fname"]} ${selectedTrainer?.[0]?.["lname"]} isimli eğitmeni kulüp çalışanlarınız arasından çıkarmak istediğinize emin misiniz?`}</h4>
      </div>
      <button onClick={handleDeleteStaff} className={styles["button"]}>
        Personeli Sil
      </button>
    </Modal>
  );
};

export default DeleteClubStaffModal;
