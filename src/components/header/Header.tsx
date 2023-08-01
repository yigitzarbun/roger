import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import styles from "./styles.module.scss";
import paths from "../../routing/Paths";

import { logOut } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

//import i18n from "../../common/i18n/i18n";

import SearchBar from "./search/SearchBar";
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
      <NavLink
        to={paths.HOME}
        className={({ isActive }) =>
          isActive
            ? `${styles["active-logo-title"]}`
            : `${styles["logo-title"]}`
        }
      >
        Roger
      </NavLink>
      {isLoggedIn && <SearchBar />}
      {isUserPlayer && <PlayerHeader />}
      {isUserTrainer && <TrainerHeader />}
      {isUserClub && <ClubHeader />}
      {isLoggedIn ? (
        <div className={styles["credentials-nav"]}>
          <NavLink
            to={paths.PROFILE}
            className={({ isActive }) =>
              isActive
                ? `${styles["active-nav-link"]}`
                : `${styles["nav-link"]}`
            }
          >
            {isLoggedIn && isUserPlayer
              ? user.user.playerDetails?.fname
              : isLoggedIn && isUserTrainer
              ? user.user.trainerDetails?.fname
              : isLoggedIn && isUserClub
              ? user.user.clubDetails?.club_name
              : "Profil"}
          </NavLink>
          <button className={styles["logout-link"]} onClick={handleLogout}>
            Çıkış
          </button>
        </div>
      ) : (
        <div className={styles["credentials-nav"]}>
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
  );
};

export default Header;
