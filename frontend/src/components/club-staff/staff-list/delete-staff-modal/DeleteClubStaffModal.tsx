import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";
import {
  useGetClubStaffQuery,
  useUpdateClubStaffMutation,
} from "../../../../../api/endpoints/ClubStaffApi";
import { imageUrl } from "../../../../common/constants/apiConstants";

interface DeleteClubStaffModalProps {
  isDeleteStaffModalOpen: boolean;
  closeDeleteStaffModal: () => void;
  selectedClubStaff: any;
}

const DeleteClubStaffModal = (props: DeleteClubStaffModalProps) => {
  const { isDeleteStaffModalOpen, closeDeleteStaffModal, selectedClubStaff } =
    props;

  const { t } = useTranslation();

  const { refetch: refetchAllClubStaff } = useGetClubStaffQuery({});

  const selectedTrainerImage = selectedClubStaff?.trainerImage;

  const [updateClubStaff, { isSuccess }] = useUpdateClubStaffMutation({});

  const handleDeleteStaff = () => {
    const updatedStaffData = {
      employment_status: "terminated_by_club",
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
      toast.success("Personel silindi");
      closeDeleteStaffModal();
    }
  }, [isSuccess]);

  return (
    <ReactModal
      isOpen={isDeleteStaffModalOpen}
      onRequestClose={closeDeleteStaffModal}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={closeDeleteStaffModal} />
      <div className={styles["modal-content"]}>
        <h1 className={styles.title}>{t("deleteStaff")}</h1>
        <div className={styles["trainer-container"]}>
          <img
            src={
              selectedTrainerImage
                ? `${imageUrl}/${selectedTrainerImage}`
                : "images/icons/avatar.jpg"
            }
            className={styles["trainer-image"]}
          />
          <p>{`${selectedClubStaff?.fname} ${selectedClubStaff?.lname} ${t(
            "removeStaffText"
          )}`}</p>
        </div>
        <div className={styles["buttons-container"]}>
          <button
            onClick={closeDeleteStaffModal}
            className={styles["discard-button"]}
          >
            {t("discardButtonText")}
          </button>
          <button
            onClick={handleDeleteStaff}
            className={styles["submit-button"]}
          >
            {t("deleteStaff")}
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default DeleteClubStaffModal;
