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

  const { user } = useAppSelector((store) => store);
  const userType = user.user?.user?.user_type_id;

  const handleLogout = () => {
    dispatch(logOut());
    navigate(paths.LOGIN);
  };

  const isLoggedIn = user.token;
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
      {userType === 1 && <PlayerHeader />}
      {userType === 2 && <TrainerHeader />}
      {userType === 3 && <ClubHeader />}
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
            {user.user && userType === 1
              ? user.user.playerDetails?.fname
              : userType === 2
              ? user.user.trainerDetails?.fname
              : userType === 3
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
