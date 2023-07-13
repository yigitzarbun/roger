import React from "react";
import { Link, useNavigate } from "react-router-dom";
import paths from "../../routing/Paths";
import styles from "./styles.module.scss";
import { useState } from "react";
import i18n from "../../common/i18n/i18n";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logOut } from "../../store/slices/authSlice";

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((store) => store.user);

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
      <Link to={paths.HOME} className={styles["logo-title"]}>
        Roger
      </Link>

      <nav className={styles["header-nav-container"]}>
        {searchBar && (
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
              <Link to={paths.TRAIN} className={styles["nav-link"]}>
                Antreman
              </Link>
              <Link to={paths.MATCH} className={styles["nav-link"]}>
                Maç
              </Link>
              <Link to={paths.LESSON} className={styles["nav-link"]}>
                Ders
              </Link>
            </div>
            <div className={styles["header-nav-sub-container"]}>
              <Link to={paths.CALENDAR} className={styles["nav-link"]}>
                Takvim
              </Link>
              <Link to={paths.REQUESTS} className={styles["nav-link"]}>
                Davetler
              </Link>
            </div>
            <div className={styles["header-nav-sub-container"]}>
              <Link to={paths.PROFILE} className={styles["nav-link"]}>
                {user ? user.fname : "Profil"}
              </Link>
              <button className={styles["nav-link"]} onClick={handleLogout}>
                Çıkış
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to={paths.LOGIN} className={styles["nav-link"]}>
              Giriş
            </Link>
            <Link to={paths.REGISTER} className={styles["nav-link"]}>
              Kayıt
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Header;
