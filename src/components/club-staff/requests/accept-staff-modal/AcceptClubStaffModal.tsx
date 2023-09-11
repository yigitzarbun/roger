import React, { useEffect, useState } from "react";

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

interface AcceptClubStaffModalProps {
  isAcceptClubStaffModalOpen: boolean;
  closeAcceptClubStaffModal: () => void;
  selectedClubStaffUserId: number;
}

const AcceptClubStaffModal = (props: AcceptClubStaffModalProps) => {
  const {
    isAcceptClubStaffModalOpen,
    closeAcceptClubStaffModal,
    selectedClubStaffUserId,
  } = props;

  const { refetch: refetchAllClubStaff } = useGetClubStaffQuery({});

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

  const handleAcceptClubStaff = () => {
    const updatedStaffData = {
      ...selectedClubStaff?.[0],
      employment_status: "accepted",
    };
    updateClubStaff(updatedStaffData);
  };

  useEffect(() => {
    if (isSuccess) {
      refetchClubStaff();
      refetchAllClubStaff();
      toast.success("Personel eklendi");
      closeAcceptClubStaffModal();
    }
  }, [isSuccess]);

  if (isSelectedClubStaffLoading || isSelectedTrainerLoading) {
    return <PageLoading />;
  }

  return (
    <Modal
      isOpen={isAcceptClubStaffModalOpen}
      onRequestClose={closeAcceptClubStaffModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1 className={styles.title}>Personel Onayla</h1>
        <FaWindowClose
          onClick={closeAcceptClubStaffModal}
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
        <h4>{`${selectedTrainer?.[0]?.["fname"]} ${selectedTrainer?.[0]?.["lname"]} kulübünüzde çalıştığını belirtti. Başvuruyu onaylıyor musunuz?`}</h4>
      </div>
      <button onClick={handleAcceptClubStaff} className={styles["button"]}>
        Onayla
      </button>
    </Modal>
  );
};

export default AcceptClubStaffModal;
