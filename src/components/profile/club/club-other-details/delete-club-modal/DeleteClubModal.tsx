import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { logOut } from "../../../../../store/slices/authSlice";
import paths from "../../../../../routing/Paths";
import { useUpdateUserMutation } from "../../../../../store/auth/apiSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDeactivateDeletedClubCourtsMutation } from "../../../../../api/endpoints/CourtsApi";

const DeleteClubModal = (props) => {
  const { clubDetails, isDeleteClubModalOpen, handleCloseDeleteClubModal } =
    props;

  const [deleteUser, { isSuccess: deleteClubSuccess }] = useUpdateUserMutation(
    clubDetails?.[0]?.user_id
  );

  const [deactivateCourts, { isSuccess: courtsDeactivatedSuccess }] =
    useDeactivateDeletedClubCourtsMutation(clubDetails?.[0]?.club_id);

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleDeleteConfirmation = (e) => {
    setDeleteConfirmation(e.target.value);
  };

  const handleDelete = () => {
    if (
      email === clubDetails?.[0]?.email &&
      deleteConfirmation === "hesabımı silmek istiyorum"
    ) {
      const updatedUser = {
        user_id: clubDetails?.[0]?.user_id,
        email: clubDetails?.[0]?.email,
        password: clubDetails?.[0]?.password,
        registered_at: clubDetails?.[0]?.registered_at,
        user_type_id: clubDetails?.[0]?.user_type_id,
        user_status_type_id: 3,
      };
      deleteUser(updatedUser);
    } else {
      toast.error("İşlem başarısız");
    }
  };

  useEffect(() => {
    if (deleteClubSuccess) {
      deactivateCourts(clubDetails?.[0]?.club_id);
    }
  }, [deleteClubSuccess]);

  useEffect(() => {
    if (courtsDeactivatedSuccess) {
      toast.success("Hesap silindi");
      logOut();
      navigate(paths.LOGIN);
    }
  }, [courtsDeactivatedSuccess]);

  return (
    <ReactModal
      isOpen={isDeleteClubModalOpen}
      onRequestClose={handleCloseDeleteClubModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={handleCloseDeleteClubModal} />
      <div className={styles["modal-content"]}>
        <h3>Hesabı Sil</h3>
        <p>
          Hesabınıza ait tüm bilgiler silinecektir ve bu işlemin geri dönüşü
          olmayacaktır.
        </p>
        <div className={styles["input-container"]}>
          <label>Devam etmek için kayıtlı e-posta adresinizi yazın</label>
          <input type="text" onChange={handleEmail} />
        </div>
        <div className={styles["input-container"]}>
          <label>Aşağıdaki alana hesabımı silmek istiyorum yazın</label>
          <input type="text" onChange={handleDeleteConfirmation} />
        </div>
        <div className={styles["buttons-container"]}>
          <button
            className={styles["discard-button"]}
            onClick={handleCloseDeleteClubModal}
          >
            İptal
          </button>
          <button className={styles["submit-button"]} onClick={handleDelete}>
            Hesabı Sil
          </button>
        </div>
      </div>
    </ReactModal>
  );
};
export default DeleteClubModal;
