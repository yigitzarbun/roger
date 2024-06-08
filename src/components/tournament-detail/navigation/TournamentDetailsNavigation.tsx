import React from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";

interface TournamentDetailsNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
}

const TournamentDetailsNavigation = ({
  display,
  handleDisplay,
}: TournamentDetailsNavigationProps) => {
  const user = useAppSelector((store) => store?.user?.user);

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
        <span>Katılımcılar</span>
      </button>
      <button
        onClick={() => handleDisplay("details")}
        className={
          display === "details"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        <span>Turnuva Bilgileri</span>
      </button>
      <button
        onClick={() => handleDisplay("fixture")}
        className={
          display === "details"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        <span>Fikstür</span>
      </button>
    </div>
  );
};

export default TournamentDetailsNavigation;
