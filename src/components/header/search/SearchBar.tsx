import React, { useState } from "react";
import { useAppSelector } from "../../../store/hooks";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import i18n from "../../../common/i18n/i18n";

const SearchBar = () => {
  const { user } = useAppSelector((store) => store);
  const isLoggedIn = user.user;

  const navigate = useNavigate();

  // search bar
  const [searchBar, setSearchBar] = useState(false);

  const handleSearchBar = () => {
    setSearchBar((prev) => !prev);
    setSearch("");
  };

  // search value
  const [search, setSearch] = useState("");

  const handleSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    navigate("/", { state: { search: search } });
  };

  return (
    <div className={styles["search-container"]}>
      {isLoggedIn && (
        <>
          {searchBar ? (
            <div className={styles["search-open-container"]}>
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
          ) : (
            <img
              src="/images/icons/search.png"
              className={styles["search-icon"]}
              onClick={handleSearchBar}
            />
          )}
        </>
      )}
    </div>
  );
};
export default SearchBar;
