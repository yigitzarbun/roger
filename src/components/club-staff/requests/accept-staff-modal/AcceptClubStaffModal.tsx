import React, { useEffect, useState } from "react";

import Modal from "react-modal";

import { FaWindowClose } from "react-icons/fa";

import styles from "./styles.module.scss";

import {
  useGetClubStaffQuery,
  useUpdateClubStaffMutation,
} from "../../../../api/endpoints/ClubStaffApi";
import PageLoading from "../../../../components/loading/PageLoading";

interface AcceptClubStaffModalProps {
  isAcceptClubStaffModalOpen: boolean;
  closeAcceptClubStaffModal: () => void;
  selectedClubStaffId: number;
}

const AcceptClubStaffModal = (props: AcceptClubStaffModalProps) => {
  const {
    isAcceptClubStaffModalOpen,
    closeAcceptClubStaffModal,
    selectedClubStaffId,
  } = props;

  const { data: clubStaff, isLoading: isClubStaffLoading } =
    useGetClubStaffQuery({});

  const selectedClubStaff = clubStaff?.find(
    (staff) => staff.club_staff_id === selectedClubStaffId
  );

  const [updateClubStaff, { isSuccess }] = useUpdateClubStaffMutation({});

  const [updatedClubStaffData, setUpdatedClubStaffData] = useState(null);

  const handleAcceptClubStaff = () => {
    setUpdatedClubStaffData({
      ...selectedClubStaff,
      employment_status: "accepted",
    });
    updateClubStaff(updatedClubStaffData);
  };

  useEffect(() => {
    if (updatedClubStaffData) {
      updateClubStaff(updatedClubStaffData);
    }
  }, [updatedClubStaffData]);

  useEffect(() => {
    if (isSuccess) {
      closeAcceptClubStaffModal();
    }
  }, [isSuccess]);

  if (isClubStaffLoading) {
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
      <h4>{`${selectedClubStaff?.fname} ${selectedClubStaff?.lname} kulübünüzde çalıştığını belirtti. Başvuruyu onaylıyor musunuz?`}</h4>
      <button onClick={handleAcceptClubStaff} className={styles["button"]}>
        Onayla
      </button>
    </Modal>
  );
};

export default AcceptClubStaffModal;
