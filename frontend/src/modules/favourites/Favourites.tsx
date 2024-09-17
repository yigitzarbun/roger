import React, { useState, ChangeEvent } from "react";
import FavouritesResults from "../../components/favourites/FavouritesResults";
import styles from "./styles.module.scss";
import FavouritesFilter from "../../components/favourites/filter/FavouritesFilter";

const Favourites = () => {
  const [textSearch, setTextSearch] = useState<string>("");
  const [locationId, setLocationId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userTypeId, setUserTypeId] = useState(null);

  const handleTextSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    setTextSearch(event.target.value);
  };

  const handleLocation = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(1);
    const value = parseInt(event.target.value, 10);
    setLocationId(isNaN(value) ? null : value);
  };

  const handleUserType = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(1);
    const value = parseInt(event.target.value, 10);
    setUserTypeId(isNaN(value) ? null : value);
  };
  const handleClear = () => {
    setCurrentPage(1);
    setUserTypeId(null);
    setTextSearch("");
    setLocationId(null);
  };

  return (
    <div className={styles["favourites-container"]}>
      <FavouritesFilter
        textSearch={textSearch}
        locationId={locationId}
        userTypeId={userTypeId}
        handleTextSearch={handleTextSearch}
        handleLocation={handleLocation}
        handleUserType={handleUserType}
        handleClear={handleClear}
      />
      <FavouritesResults
        textSearch={textSearch}
        locationId={locationId}
        userTypeId={userTypeId}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};
export default Favourites;
