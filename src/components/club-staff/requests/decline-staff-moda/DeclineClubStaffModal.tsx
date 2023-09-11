import React, { useEffect } from "react";

import Modal from "react-modal";

import { toast } from "react-toastify";

import { FaWindowClose } from "react-icons/fa";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";

import {
  useGetClubStaffByFilterQuery,
  useUpdateClubStaffMutation,
} from "../../../../api/endpoints/ClubStaffApi";
import { useGetTrainersByFilterQuery } from "../../../../api/endpoints/TrainersApi";

interface DeclineClubStaffModalProps {
  isDeclineClubStaffModalOpen: boolean;
  closeDeclineClubStaffModal: () => void;
  selectedClubStaffUserId: number;
}

const DeclineClubStaffModal = (props: DeclineClubStaffModalProps) => {
  const {
    isDeclineClubStaffModalOpen,
    closeDeclineClubStaffModal,
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

  const handleDeclineClubStaff = () => {
    const updatedStaffData = {
      ...selectedClubStaff?.[0],
      employment_status: "declined",
    };
    updateClubStaff(updatedStaffData);
  };

  useEffect(() => {
    if (isSuccess) {
      refetchClubStaff();
      toast.success("Personel eklendi");
      closeDeclineClubStaffModal();
    }
  }, [isSuccess]);

  if (isSelectedClubStaffLoading || isSelectedTrainerLoading) {
    return <PageLoading />;
  }

  return (
    <Modal
      isOpen={isDeclineClubStaffModalOpen}
      onRequestClose={closeDeclineClubStaffModal}
      className={styles["modal-container"]}
    >
      <div className={styles["top-container"]}>
        <h1 className={styles.title}>Başvuruyu Reddet</h1>
        <FaWindowClose
          onClick={closeDeclineClubStaffModal}
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
        <h4>{`${selectedTrainer?.[0]?.["fname"]} ${selectedTrainer?.[0]?.["lname"]} kulübünüzde çalıştığını belirtti. Başvuruyu reddetmek istediğinize emin misiniz?`}</h4>
      </div>
      <button onClick={handleDeclineClubStaff} className={styles["button"]}>
        Reddet
      </button>
    </Modal>
  );
};

export default DeclineClubStaffModal;
