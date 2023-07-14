import React from "react";
import { Dispatch, SetStateAction } from "react";

import styles from "./styles.module.scss";

interface CommonRegisterNavProps {
  setUserType: Dispatch<SetStateAction<string>>;
}

const CommonRegisterNav = ({ setUserType }: CommonRegisterNavProps) => {
  return (
    <div className={styles["common-register-container"]}>
      <img className={styles["hero"]} src="/images/hero/court5.jpeg" />
      <div className={styles["user-type-outer-container"]}>
        <h1>Aşağıdakilerden hangisi seni en iyi tarif ediyor?</h1>
        <div className={styles["user-type-options-container"]}>
          <div
            onClick={() => setUserType("player")}
            className={styles["user-type-container"]}
          >
            <h2 className={styles["user-type-title"]}>Oyuncu</h2>
          </div>
          <div
            onClick={() => setUserType("club")}
            className={styles["user-type-container"]}
          >
            <h2 className={styles["user-type-title"]}>Kulüp</h2>
          </div>
          <div
            onClick={() => setUserType("trainer")}
            className={styles["user-type-container"]}
          >
            <h2 className={styles["user-type-title"]}>Eğitmen</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonRegisterNav;
