import React, { useEffect } from "react";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";
import {
  useGetClubStaffQuery,
  useUpdateClubStaffMutation,
} from "../../../../../api/endpoints/ClubStaffApi";
import { useTranslation } from "react-i18next";

interface DeclineClubStaffModalProps {
  isDeclineClubStaffModalOpen: boolean;
  closeDeclineClubStaffModal: () => void;
  selectedClubStaff: any;
}

const DeclineClubStaffModal = (props: DeclineClubStaffModalProps) => {
  const {
    isDeclineClubStaffModalOpen,
    closeDeclineClubStaffModal,
    selectedClubStaff,
  } = props;

  const { t } = useTranslation();

  const selectedTrainerImage = selectedClubStaff?.trainerImage;

  const [updateClubStaff, { isSuccess }] = useUpdateClubStaffMutation({});

  const { refetch: refetchAllClubStaff } = useGetClubStaffQuery({});

  const handleDeclineClubStaff = () => {
    const updatedStaffData = {
      employment_status: "declined",
      club_staff_id: selectedClubStaff.club_staff_id,
      fname: selectedClubStaff.fname,
      lname: selectedClubStaff.lname,
      birth_year: selectedClubStaff.birth_year,
      gender: selectedClubStaff.gender,
      image: selectedClubStaff.trainerImage,
      club_id: selectedClubStaff.club_id,
      club_staff_role_type_id: selectedClubStaff.club_staff_role_type_id,
      user_id: selectedClubStaff.clubStaffUserId,
    };
    updateClubStaff(updatedStaffData);
  };

  useEffect(() => {
    if (isSuccess) {
      refetchAllClubStaff();
      toast.success("Başvuru reddedildi");
      closeDeclineClubStaffModal();
    }
  }, [isSuccess]);

  return (
    <ReactModal
      isOpen={isDeclineClubStaffModalOpen}
      onRequestClose={closeDeclineClubStaffModal}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeDeclineClubStaffModal} />
      <div className={styles["modal-content"]}>
        <h1 className={styles.title}>
          {t("declineClubStaffApplicationTitle")}
        </h1>

        <div className={styles["trainer-container"]}>
          <img
            src={
              selectedTrainerImage
                ? selectedTrainerImage
                : "images/icons/avatar.jpg"
            }
            className={styles["trainer-image"]}
          />
          <p>{`${selectedClubStaff?.fname} ${selectedClubStaff?.lname} ${t(
            "declineClubStaffApplicationText"
          )}`}</p>
        </div>
        <div className={styles["buttons-container"]}>
          <button
            onClick={closeDeclineClubStaffModal}
            className={styles["discard-button"]}
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleDeclineClubStaff}
            className={styles["submit-button"]}
          >
            {t("confirm")}
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default DeclineClubStaffModal;
