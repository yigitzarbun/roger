import React from "react";
import ReactModal from "react-modal";
import { IoIosSettings } from "react-icons/io";
import { FaRegCreditCard } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import { RiGroupLine } from "react-icons/ri";
import { FaBuildingUser } from "react-icons/fa6";

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
        <div className={styles["menu-item"]}>
          <h4 onClick={() => navigateUser("PROFILE")}>Ayarlar</h4>
          <IoIosSettings className={styles.icon} />
        </div>
        <div className={styles["menu-item"]}>
          <h4 onClick={() => navigateUser("PAYMENTS")}>Ödemeler</h4>
          <FaRegCreditCard className={styles.icon} />
        </div>
        <div className={styles["menu-item"]}>
          <h4 onClick={() => navigateUser("SOCIAL")}>Üyelikler</h4>
          <FaBuildingUser className={styles.icon} />
        </div>
        <div className={styles["menu-item"]}>
          <h4 onClick={() => navigateUser("SOCIAL")}>Gruplar</h4>
          <RiGroupLine className={styles.icon} />
        </div>
        <div className={styles["menu-item"]}>
          <h4 onClick={() => navigateUser("SOCIAL")}>Favoriler</h4>
          <IoStar className={styles.icon} />
        </div>
        <button onClick={handleLogout} className={styles.logout}>
          Çıkış
        </button>
      </div>
    </ReactModal>
  );
};

export default ProfileModal;
