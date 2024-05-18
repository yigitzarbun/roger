import React, { useState } from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { logOut } from "../../../../../store/slices/authSlice";
import paths from "../../../../../routing/Paths";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../../../../store/auth/apiSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DeleteTrainerModal = (props) => {
  const {
    trainerDetails,
    isDeleteTrainerModalOpen,
    handleCloseDeleteTrainerModal,
  } = props;

  const [deleteUser] = useUpdateUserMutation(trainerDetails?.trainerUserId);
  const { data: userData, isLoading: isUserDataLoading } = useGetUserByIdQuery(
    trainerDetails?.trainerUserId
  );

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
      email === trainerDetails?.email &&
      deleteConfirmation === "hesabımı silmek istiyorum"
    ) {
      const updatedUser = {
        user_id: trainerDetails?.trainerUserId,
        email: trainerDetails?.email,
        password: trainerDetails?.password,
        registered_at: trainerDetails?.registered_at,
        user_type_id: trainerDetails?.user_type_id,
        user_status_type_id: 3,
      };
      deleteUser(updatedUser);
      logOut();
      navigate(paths.LOGIN);
      toast.success("Hesap silindi");
    } else {
      toast.error("İşlem başarısız");
    }
  };
  return (
    <ReactModal
      isOpen={isDeleteTrainerModalOpen}
      onRequestClose={handleCloseDeleteTrainerModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div
        className={styles["overlay"]}
        onClick={handleCloseDeleteTrainerModal}
      />
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
            onClick={handleCloseDeleteTrainerModal}
          >
            İptal
          </button>
          <button className={styles["delete-button"]} onClick={handleDelete}>
            Hesabı Sil
          </button>
        </div>
      </div>
    </ReactModal>
  );
};
export default DeleteTrainerModal;
