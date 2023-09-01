import React, { useEffect, useState } from "react";

import Modal from "react-modal";

import { FaWindowClose } from "react-icons/fa";

import styles from "./styles.module.scss";

import {
  useGetClubStaffQuery,
  useUpdateClubStaffMutation,
} from "../../../../api/endpoints/ClubStaffApi";
import PageLoading from "../../../../components/loading/PageLoading";

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

  const { data: clubStaff, isLoading: isClubStaffLoading } =
    useGetClubStaffQuery({});

  const selectedClubStaff = clubStaff?.find(
    (staff) => staff.club_staff_id === selectedClubStaffId
  );

  const [updateClubStaff, { isSuccess }] = useUpdateClubStaffMutation({});

  const [updatedClubStaffData, setUpdatedClubStaffData] = useState(null);

  const handleDeclineClubStaff = () => {
    setUpdatedClubStaffData({
      ...selectedClubStaff,
      employment_status: "declined",
    });
  };

  useEffect(() => {
    if (updatedClubStaffData) {
      updateClubStaff(updatedClubStaffData);
    }
  }, [updatedClubStaffData]);

  useEffect(() => {
    if (isSuccess) {
      closeDeclineClubStaffModal();
    }
  }, [isSuccess]);

  if (isClubStaffLoading) {
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
      <h4>{`${selectedClubStaff?.fname} ${selectedClubStaff?.lname} kulübünüzde çalıştığını belirtti. Başvuruyu onaylıyor musunuz?`}</h4>
      <button onClick={handleDeclineClubStaff} className={styles["button"]}>
        Reddet
      </button>
    </Modal>
  );
};

export default DeclineClubStaffModal;
