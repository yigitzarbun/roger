import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

import styles from "./styles.module.scss";
import paths from "../../routing/Paths";

import { useAppSelector } from "../../store/hooks";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useGetPlayerProfileDetailsQuery } from "../../api/endpoints/PlayersApi";
import { MdOutlineLanguage } from "react-icons/md";
import { localUrl } from "../../common/constants/apiConstants";

import PlayerHeader from "./player/PlayerHeader";
import TrainerHeader from "./trainer/TrainerHeader";
import ClubHeader from "./club/ClubHeader";
import ProfileModal from "./modals/profile/ProfileModal";
import PageLoading from "../../components/loading/PageLoading";
import LanguageModal from "./modals/language/LanguageModal";

const Header = () => {
  const user = useAppSelector((store) => store?.user);
  const navigate = useNavigate();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const handleOpenProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const handleOpenLanguageModal = () => {
    setIsLanguageModalOpen(true);
  };

  const handleCloseLanguageModal = () => {
    setIsLanguageModalOpen(false);
  };
  const { data: playerDetails, isLoading: isPlayerDetailsLoading } =
    useGetPlayerProfileDetailsQuery(user?.user?.user?.user_id);

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };
  const navigateUser = (path: string) => {
    navigate(paths[path]);
    handleCloseProfileModal();
  };
  let isUserPlayer = false;
  let isUserTrainer = false;
  let isUserClub = false;

  if (user && user.user && user.user.user) {
    isUserPlayer = user?.user.user.user_type_id === 1;
    isUserTrainer = user?.user.user.user_type_id === 2;
    isUserClub = user?.user.user.user_type_id === 3;
  }
  const isLoggedIn = user?.token ? true : false;

  if (isPlayerDetailsLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["header-container"]}>
      <div className={styles["top-container"]}>
        <NavLink
          to={paths.HOME}
          onClick={() => navigateUser("HOME")}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-logo-title"]}`
              : `${styles["logo-title"]}`
          }
        >
          Raket
        </NavLink>
        {isLoggedIn ? (
          <div className={styles["user-nav"]}>
            <IoIosNotificationsOutline className={styles.notification} />
            <MdOutlineLanguage
              className={styles.notification}
              onClick={handleOpenLanguageModal}
            />

            {isLoggedIn && (
              <img
                src={
                  isUserPlayer && playerDetails?.[0]?.image
                    ? `${localUrl}/${playerDetails?.[0]?.image}`
                    : //: isUserTrainer && trainerDetails?.[0]?.image
                      //? trainerDetails?.[0]?.image
                      //: isUserClub && clubDetails?.[0]?.image
                      //? clubDetails?.[0]?.image
                      "/images/icons/avatar.jpg"
                }
                alt="avatar"
                className={styles["profile-image"]}
                onClick={handleOpenProfileModal}
              />
            )}
          </div>
        ) : (
          <div className={styles["user-nav"]}>
            <NavLink
              to={paths.LOGIN}
              onClick={() => navigateUser("LOGIN")}
              className={({ isActive }) =>
                isActive
                  ? `${styles["active-nav-link"]}`
                  : `${styles["nav-link"]}`
              }
            >
              Giriş
            </NavLink>
            <NavLink
              to={paths.REGISTER}
              onClick={() => navigateUser("REGISTER")}
              className={({ isActive }) =>
                isActive
                  ? `${styles["active-nav-link"]}`
                  : `${styles["nav-link"]}`
              }
            >
              Kayıt
            </NavLink>
            <MdOutlineLanguage
              className={styles.notification}
              onClick={handleOpenLanguageModal}
            />
          </div>
        )}
      </div>
      {isUserPlayer && (
        <PlayerHeader
          navigateUser={navigateUser}
          handleCloseProfileModal={handleCloseProfileModal}
        />
      )}
      {isUserTrainer && <TrainerHeader />}
      {isUserClub && <ClubHeader />}
      {isProfileModalOpen && (
        <ProfileModal
          isProfileModalOpen={isProfileModalOpen}
          handleCloseProfileModal={handleCloseProfileModal}
          email={user?.user?.user?.email}
        />
      )}
      {isLanguageModalOpen && (
        <LanguageModal
          isLanguageModalOpen={isLanguageModalOpen}
          handleCloseLanguageModal={handleCloseLanguageModal}
        />
      )}
    </div>
  );
};

export default Header;
