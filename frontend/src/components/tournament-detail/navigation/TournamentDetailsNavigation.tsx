import React from "react";
import styles from "./styles.module.scss";
import { useAppSelector } from "../../../store/hooks";
import { useTranslation } from "react-i18next";

interface TournamentDetailsNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
}

const TournamentDetailsNavigation = ({
  display,
  handleDisplay,
}: TournamentDetailsNavigationProps) => {
  const user = useAppSelector((store) => store?.user?.user);

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
        <span>{t("tournamentParticipants")}</span>
      </button>
      <button
        onClick={() => handleDisplay("details")}
        className={
          display === "details"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        <span>{t("tournamentInfo")}</span>
      </button>
      <button
        onClick={() => handleDisplay("fixture")}
        className={
          display === "fixture"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        <span>{t("fixture")}</span>
      </button>
    </div>
  );
};

export default TournamentDetailsNavigation;
