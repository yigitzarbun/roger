import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import paths from "../../routing/Paths";
import styles from "./styles.module.scss";
import { useState } from "react";
import i18n from "../../common/i18n/i18n";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logOut } from "../../store/slices/authSlice";

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((store) => store);

  const [searchBar, setSearchBar] = useState(false);

  const handleSearchBar = () => {
    setSearchBar((prev) => !prev);
    setSearch("");
  };

  const [search, setSearch] = useState("");

  const handleSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    navigate("/", { state: { search: search } });
  };

  const handleLogout = () => {
    dispatch(logOut());
    navigate(paths.LOGIN);
  };

  const isLoggedIn = user;

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

      <nav className={styles["header-nav-container"]}>
        {searchBar && isLoggedIn && (
          <div className={styles["search-container"]}>
            <input
              onChange={handleSearchValue}
              type="text"
              value={search}
              placeholder={i18n.t("headerSearchPlaceholder")}
              className={styles["search-input"]}
            />
            <div className={styles["search-buttons-container"]}>
              <button
                onClick={handleSearch}
                className={styles["search-button"]}
              >
                Ara
              </button>
              <button
                onClick={handleSearchBar}
                className={styles["clear-button"]}
              >
                Kapat
              </button>
            </div>
          </div>
        )}
        {!searchBar && (
          <img
            src="/images/icons/search.png"
            className={styles["search-icon"]}
            onClick={handleSearchBar}
          />
        )}

        {isLoggedIn ? (
          <>
            <div className={styles["header-nav-sub-container"]}>
              <NavLink
                to={paths.TRAIN}
                className={({ isActive }) =>
                  isActive
                    ? `${styles["active-nav-link"]}`
                    : `${styles["nav-link"]}`
                }
              >
                Antreman
              </NavLink>
              <NavLink
                to={paths.MATCH}
                className={({ isActive }) =>
                  isActive
                    ? `${styles["active-nav-link"]}`
                    : `${styles["nav-link"]}`
                }
              >
                Maç
              </NavLink>
              <NavLink
                to={paths.LESSON}
                className={({ isActive }) =>
                  isActive
                    ? `${styles["active-nav-link"]}`
                    : `${styles["nav-link"]}`
                }
              >
                Ders
              </NavLink>
            </div>
            <div className={styles["header-nav-sub-container"]}>
              <NavLink
                to={paths.CALENDAR}
                className={({ isActive }) =>
                  isActive
                    ? `${styles["active-nav-link"]}`
                    : `${styles["nav-link"]}`
                }
              >
                Takvim
              </NavLink>
              <NavLink
                to={paths.REQUESTS}
                className={({ isActive }) =>
                  isActive
                    ? `${styles["active-nav-link"]}`
                    : `${styles["nav-link"]}`
                }
              >
                Davetler
              </NavLink>
            </div>
            <div className={styles["header-nav-sub-container"]}>
              <NavLink
                to={paths.PROFILE}
                className={({ isActive }) =>
                  isActive
                    ? `${styles["active-nav-link"]}`
                    : `${styles["nav-link"]}`
                }
              >
                {user.user ? user.user.email : "Profil"}
              </NavLink>
              <button className={styles["nav-link"]} onClick={handleLogout}>
                Çıkış
              </button>
            </div>
          </>
        ) : (
          <>
            <NavLink to={paths.LOGIN} className={styles["nav-link"]}>
              Giriş
            </NavLink>
            <NavLink to={paths.REGISTER} className={styles["nav-link"]}>
              Kayıt
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
};

export default Header;
