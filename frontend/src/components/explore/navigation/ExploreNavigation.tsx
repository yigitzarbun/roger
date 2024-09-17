import React from "react";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

interface ExploreNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
}

const ExploreNavigation = ({
  display,
  handleDisplay,
}: ExploreNavigationProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles["nav-container"]}>
      <button
        onClick={() => handleDisplay("players")}
        className={
          display === "players"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        {t("explorePlayersTabTitle")}
      </button>
      <button
        onClick={() => handleDisplay("trainers")}
        className={
          display === "trainers"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        {t("exploreTrainersTabTitle")}
      </button>
      <button
        onClick={() => handleDisplay("clubs")}
        className={
          display === "clubs"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        {t("exploreClubsTabTitle")}
      </button>
      <button
        onClick={() => handleDisplay("courts")}
        className={
          display === "courts"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        {t("exploreCourtsTabTitle")}
      </button>
    </div>
  );
};

export default ExploreNavigation;
