import React from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";

interface PlayerTournamentsNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
}

const PlayerTournamentsNavigation = ({
  display,
  handleDisplay,
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
        <span className={styles.notification}> (2)</span>
      </button>
    </div>
  );
};

export default PlayerTournamentsNavigation;
