import React from "react";
import FavouritesResults from "../../components/favourites/FavouritesResults";
import styles from "./styles.module.scss";
const Favourites = () => {
  return (
    <div className={styles["favourites-container"]}>
      <FavouritesResults />
    </div>
  );
};
export default Favourites;
