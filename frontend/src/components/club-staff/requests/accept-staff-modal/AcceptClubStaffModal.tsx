import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";
import {
  useGetClubStaffQuery,
  useUpdateClubStaffMutation,
} from "../../../../../api/endpoints/ClubStaffApi";

interface AcceptClubStaffModalProps {
  isAcceptClubStaffModalOpen: boolean;
  closeAcceptClubStaffModal: () => void;
  selectedClubStaff: any;
}

const AcceptClubStaffModal = (props: AcceptClubStaffModalProps) => {
  const {
    isAcceptClubStaffModalOpen,
    closeAcceptClubStaffModal,
    selectedClubStaff,
  } = props;

  const { t } = useTranslation();

  const { refetch: refetchAllClubStaff } = useGetClubStaffQuery({});

  const selectedTrainerImage = selectedClubStaff?.trainerImage;

  const [updateClubStaff, { isSuccess }] = useUpdateClubStaffMutation({});

  const handleAcceptClubStaff = () => {
    const updatedStaffData = {
      employment_status: "accepted",
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
      toast.success("Personel eklendi");
      closeAcceptClubStaffModal();
    }
  }, [isSuccess]);

  return (
    <ReactModal
      isOpen={isAcceptClubStaffModalOpen}
      onRequestClose={closeAcceptClubStaffModal}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeAcceptClubStaffModal} />
      <div className={styles["modal-content"]}>
        <h1 className={styles.title}>{t("acceptClubStaffApplicationTitle")}</h1>
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
            "acceptClubStaffApplicationText"
          )}`}</p>
        </div>
        <div className={styles["buttons-container"]}>
          <button
            onClick={closeAcceptClubStaffModal}
            className={styles["discard-button"]}
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleAcceptClubStaff}
            className={styles["submit-button"]}
          >
            {t("confirm")}
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default AcceptClubStaffModal;
