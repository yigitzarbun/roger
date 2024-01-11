import React from "react";
import ReactModal from "react-modal";

import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import paths from "../../../../routing/Paths";
import { logOut } from "../../../../store/slices/authSlice";
import { useAppDispatch } from "../../../../store/hooks";

interface ProfileModalProps {
  isProfileModalOpen: boolean;
  handleCloseProfileModal: () => void;
  email: string;
}
const ProfileModal = (props: ProfileModalProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isProfileModalOpen, handleCloseProfileModal, email } = props;

  const navigateUser = (path: string) => {
    navigate(paths[path]);
    handleCloseProfileModal();
  };

  const handleLogout = () => {
    dispatch(logOut());
    handleCloseProfileModal();
    navigate(paths.LOGIN);
  };

  return (
    <ReactModal
      isOpen={isProfileModalOpen}
      onRequestClose={handleCloseProfileModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={handleCloseProfileModal} />

      <div className={styles["modal-content"]}>
        <p>{email}</p>
        <h4 onClick={() => navigateUser("PROFILE")}>Ayarlar</h4>
        <h4 onClick={() => navigateUser("PAYMENTS")}>Ödemeler</h4>
        <h4 onClick={() => navigateUser("SOCIAL")}>Üyelikler</h4>
        <h4 onClick={() => navigateUser("SOCIAL")}>Gruplar</h4>
        <h4 onClick={() => navigateUser("SOCIAL")}>Favoriler</h4>
        <button onClick={handleLogout} className={styles.logout}>
          Çıkış
        </button>
      </div>
    </ReactModal>
  );
};

export default ProfileModal;
