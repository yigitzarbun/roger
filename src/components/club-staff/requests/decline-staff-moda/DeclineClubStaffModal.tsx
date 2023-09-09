import React, { useEffect } from "react";

import Modal from "react-modal";

import { toast } from "react-toastify";

import { FaWindowClose } from "react-icons/fa";

import styles from "./styles.module.scss";

import PageLoading from "../../../../components/loading/PageLoading";

import {
  useGetClubStaffQuery,
  useUpdateClubStaffMutation,
} from "../../../../api/endpoints/ClubStaffApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";

interface DeclineClubStaffModalProps {
  isDeclineClubStaffModalOpen: boolean;
  closeDeclineClubStaffModal: () => void;
  selectedClubStaffId: number;
}

const DeclineClubStaffModal = (props: DeclineClubStaffModalProps) => {
  const {
    isDeclineClubStaffModalOpen,
    closeDeclineClubStaffModal,
    selectedClubStaffId,
  } = props;

  const {
    data: clubStaff,
    isLoading: isClubStaffLoading,
    refetch: refetchStaffData,
  } = useGetClubStaffQuery({});

  const selectedClubStaff = clubStaff?.find(
    (staff) => staff.club_staff_id === selectedClubStaffId
  );

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );

  const [updateClubStaff, { isSuccess }] = useUpdateClubStaffMutation({});

  const handleDeclineClubStaff = () => {
    const updatedStaffData = {
      ...selectedClubStaff,
      employment_status: "declined",
    };
    updateClubStaff(updatedStaffData);
  };

  useEffect(() => {
    if (isSuccess) {
      refetchStaffData();
      toast.success("İşlem başarılı");
      closeDeclineClubStaffModal();
    }
  }, [isSuccess]);

  if (isClubStaffLoading || isTrainersLoading) {
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
            trainers?.find(
              (trainer) =>
                trainer.user_id ===
                clubStaff?.find(
                  (staff) => staff.club_staff_id === selectedClubStaffId
                )?.user_id
            )?.image
              ? trainers?.find(
                  (trainer) =>
                    trainer.user_id ===
                    clubStaff?.find(
                      (staff) => staff.club_staff_id === selectedClubStaffId
                    )?.user_id
                )?.image
              : "images/icons/avatar.png"
          }
          className={styles["trainer-image"]}
        />
        <h4>{`${selectedClubStaff?.fname} ${selectedClubStaff?.lname} kulübünüzde çalıştığını belirtti. Başvuruyu reddetmek istediğinize emin misiniz?`}</h4>
      </div>
      <button onClick={handleDeclineClubStaff} className={styles["button"]}>
        Reddet
      </button>
    </Modal>
  );
};

export default DeclineClubStaffModal;
