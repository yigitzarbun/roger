import React from "react";
import ReactModal from "react-modal";
import { IoIosSettings } from "react-icons/io";
import { FaRegCreditCard } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import { RiGroupLine } from "react-icons/ri";
import { FaBuildingUser } from "react-icons/fa6";
import { GiTennisCourt } from "react-icons/gi";
import { IoPeople } from "react-icons/io5";
import { CgTennis } from "react-icons/cg";
import { PiTennisBallBold } from "react-icons/pi";

import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import paths from "../../../../routing/Paths";
import { logOut } from "../../../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";

interface ProfileModalProps {
  isProfileModalOpen: boolean;
  handleCloseProfileModal: () => void;
  handleCloseMenuModal: () => void;
  email: string;
}
const ProfileModal = (props: ProfileModalProps) => {
  const {
    isProfileModalOpen,
    handleCloseProfileModal,
    email,
    handleCloseMenuModal,
  } = props;
  const user = useAppSelector((store) => store.user?.user?.user);
  const isUserPlayer = user?.user_type_id === 1;
  const isUserTrainer = user?.user_type_id === 2;
  const isUserClub = user?.user_type_id === 3;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const navigateUser = (path: string) => {
    navigate(paths[path]);
    handleCloseMenuModal();
    handleCloseProfileModal();
  };

  const handleLogout = () => {
    dispatch(logOut());
    handleCloseProfileModal();
    navigate(paths.LOGIN);
    handleCloseMenuModal();
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
        <div
          onClick={() => navigateUser("PROFILE")}
          className={styles["menu-item"]}
        >
          <h4>Ayarlar</h4>
          <IoIosSettings className={styles.icon} />
        </div>
        <div
          onClick={() => navigateUser("PAYMENTS")}
          className={styles["menu-item"]}
        >
          <h4>Ödemeler</h4>
          <FaRegCreditCard className={styles.icon} />
        </div>
        {isUserPlayer && (
          <div
            onClick={() => navigateUser("PLAYER_SUBSCRIPTIONS")}
            className={styles["menu-item"]}
          >
            <h4>Üyelikler</h4>
            <FaBuildingUser className={styles.icon} />
          </div>
        )}
        {isUserPlayer && (
          <div
            onClick={() => navigateUser("PLAYER_GROUPS")}
            className={styles["menu-item"]}
          >
            <h4>Gruplar</h4>
            <RiGroupLine className={styles.icon} />
          </div>
        )}
        {isUserPlayer && (
          <div
            onClick={() => navigateUser("PLAYER_TRAINERS")}
            className={styles["menu-item"]}
          >
            <h4>Eğitmenlerim</h4>
            <PiTennisBallBold className={styles.icon} />
          </div>
        )}
        {isUserClub && (
          <div
            onClick={() => navigateUser("CLUB_COURTS")}
            className={styles["menu-item"]}
          >
            <h4>Kortlar</h4>
            <GiTennisCourt className={styles.icon} />
          </div>
        )}
        {isUserClub && (
          <div
            onClick={() => navigateUser("CLUB_STAFF")}
            className={styles["menu-item"]}
          >
            <h4>Personel</h4>
            <IoPeople className={styles.icon} />
          </div>
        )}
        {isUserClub && (
          <div
            onClick={() => navigateUser("CLUB_SUBSCRIPTIONS")}
            className={styles["menu-item"]}
          >
            <h4>Üyelikler</h4>
            <CgTennis className={styles.icon} />
          </div>
        )}
        <div
          onClick={() => navigateUser("FAVOURITES")}
          className={styles["menu-item"]}
        >
          <h4>Favoriler</h4>
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
