import React from "react";

import styles from "./styles.module.scss";

import TrainerSocialHero from "../../../components/social/trainer/hero/TrainerSocialHero";
import TrainerFavouritesResults from "../../../components/social/trainer/favourites/TrainerFavouritesResults";

const TrainerSocial = () => {
  return (
    <div className={styles["social-container"]}>
      <TrainerSocialHero />
      <TrainerFavouritesResults />
    </div>
  );
};
export default TrainerSocial;
