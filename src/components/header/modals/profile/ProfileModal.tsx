import React, { useRef, useEffect } from "react";
import ReactModal from "react-modal";

import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import paths from "../../../../routing/Paths";
import { logOut } from "../../../../store/slices/authSlice";
import { useAppDispatch } from "../../../../store/hooks";

interface ProfileModalProps {
  isProfileModalOpen: boolean;
  handleCloseProfileModal: () => void;
}
const ProfileModal = (props: ProfileModalProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isProfileModalOpen, handleCloseProfileModal } = props;

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
      {/* Handle closing modal when clicking on the overlay */}
      <div
        className={styles["overlay"]}
        onClick={handleCloseProfileModal} // Close modal on click
      />

      {/* Modal content */}
      <div className={styles["modal-content"]}>
        <h4 onClick={(e) => navigateUser("PROFILE")}>Ayarlar</h4>
        <h4 onClick={(e) => navigateUser("SOCIAL")}>Üyelikler</h4>
        <h4 onClick={(e) => navigateUser("SOCIAL")}>Gruplar</h4>
        <h4 onClick={(e) => navigateUser("SOCIAL")}>Favoriler</h4>
        <button onClick={handleLogout} className={styles.logout}>
          Çıkış
        </button>
      </div>
    </ReactModal>
  );
};

export default ProfileModal;
