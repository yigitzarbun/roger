import React from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";

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
  const user = useAppSelector((store) => store?.user?.user);

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
        <span>Tüm Turnuvalar</span>
      </button>
      <button
        onClick={() => handleDisplay("my-tournaments")}
        className={
          display === "my-tournaments"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        <span>Katıldığım Turnuvalar</span>
        {myTournaments?.tournaments?.length > 0 && (
          <span className={styles.notification}>
            ({myTournaments?.tournaments?.length})
          </span>
        )}
      </button>
    </div>
  );
};

export default PlayerTournamentsNavigation;
