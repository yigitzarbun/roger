import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import styles from "./styles.module.scss";
import paths from "../../routing/Paths";

import { logOut } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { IoIosNotificationsOutline } from "react-icons/io";

import PlayerHeader from "./player/PlayerHeader";
import TrainerHeader from "./trainer/TrainerHeader";
import ClubHeader from "./club/ClubHeader";

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((store) => store.user);

  let isUserPlayer = false;
  let isUserTrainer = false;
  let isUserClub = false;

  if (user && user.user && user.user.user) {
    isUserPlayer = user?.user.user.user_type_id === 1;
    isUserTrainer = user?.user.user.user_type_id === 2;
    isUserClub = user?.user.user.user_type_id === 3;
  }
  const handleLogout = () => {
    dispatch(logOut());
    navigate(paths.LOGIN);
  };
  const isLoggedIn = user?.token;
  return (
    <div className={styles["header-container"]}>
      <div className={styles["top-container"]}>
        <NavLink
          to={paths.HOME}
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

            <NavLink to={paths.PROFILE}>
              <img
                src={
                  isLoggedIn && isUserPlayer
                    ? user.user.playerDetails?.image
                    : isLoggedIn && isUserTrainer
                    ? user.user.trainerDetails?.image
                    : isLoggedIn && isUserClub
                    ? user.user.clubDetails?.image
                    : "/images/icons/avatar.jpg"
                }
                alt="avatar"
                className={styles["profile-image"]}
              />
            </NavLink>
          </div>
        ) : (
          <div className={styles["user-nav"]}>
            <NavLink
              to={paths.LOGIN}
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
              className={({ isActive }) =>
                isActive
                  ? `${styles["active-nav-link"]}`
                  : `${styles["nav-link"]}`
              }
            >
              Kayıt
            </NavLink>
          </div>
        )}
      </div>
      {isUserPlayer && <PlayerHeader />}
      {isUserTrainer && <TrainerHeader />}
      {isUserClub && <ClubHeader />}
    </div>
  );
};

export default Header;
