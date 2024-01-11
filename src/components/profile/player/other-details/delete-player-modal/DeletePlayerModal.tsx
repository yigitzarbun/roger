import React, { useState } from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import { logOut } from "../../../../../store/slices/authSlice";
import paths from "../../../../../routing/Paths";
import { useUpdateUserMutation } from "../../../../../store/auth/apiSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DeletePlayerModal = (props) => {
  const {
    playerDetails,
    isDeletePlayerModalOpen,
    handleCloseDeletePlayerModal,
  } = props;

  const [deleteUser] = useUpdateUserMutation(playerDetails?.[0]?.user_id);
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
      email === playerDetails?.[0]?.email &&
      deleteConfirmation === "hesabımı silmek istiyorum"
    ) {
      const updatedUser = {
        user_id: playerDetails?.[0]?.user_id,
        email: playerDetails?.[0]?.email,
        password: playerDetails?.[0]?.password,
        registered_at: playerDetails?.[0]?.registered_at,
        user_type_id: playerDetails?.[0]?.user_type_id,
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
      isOpen={isDeletePlayerModalOpen}
      onRequestClose={handleCloseDeletePlayerModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div
        className={styles["overlay"]}
        onClick={handleCloseDeletePlayerModal}
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
            onClick={handleCloseDeletePlayerModal}
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
export default DeletePlayerModal;
