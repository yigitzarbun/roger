import React from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";

interface ClubTournamentFixtureNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
}

const ClubTournamentFixtureNavigation = ({
  display,
  handleDisplay,
}: ClubTournamentFixtureNavigationProps) => {
  const user = useAppSelector((store) => store?.user?.user);

  return (
    <div className={styles["nav-container"]}>
      <button
        onClick={() => handleDisplay("fixture")}
        className={
          display === "fixture"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        <span>Fikstür</span>
      </button>
      <button
        onClick={() => handleDisplay("participants")}
        className={
          display === "participants"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        <span>Katılımcılar</span>
      </button>
    </div>
  );
};

export default ClubTournamentFixtureNavigation;
