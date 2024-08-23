import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";

interface PlayerTournamentsNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
  myTournaments: any;
}

const PlayerTournamentsNavigation = ({
  display,
  handleDisplay,
  myTournaments,
}: PlayerTournamentsNavigationProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles["nav-container"]}>
      <button
        onClick={() => handleDisplay("all-tournaments")}
        className={
          display === "all-tournaments"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        <span>{t("tournamentsTitle")}</span>
      </button>
      <button
        onClick={() => handleDisplay("my-tournaments")}
        className={
          display === "my-tournaments"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        <span>{t("myTournamentsTitle")}</span>
        {myTournaments?.tournaments?.length > 0 && (
          <span className={styles.notification}>
            {" "}
            ({myTournaments?.tournaments?.length})
          </span>
        )}
      </button>
    </div>
  );
};

export default PlayerTournamentsNavigation;
