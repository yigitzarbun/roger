import React from "react";
import { Dispatch, SetStateAction } from "react";

import styles from "./styles.module.scss";

interface CommonRegisterNavProps {
  setUserType: Dispatch<SetStateAction<string>>;
  userType: string;
}

const CommonRegisterNav = ({
  setUserType,
  userType,
}: CommonRegisterNavProps) => {
  return (
    <div className={styles["common-register-container"]}>
      <div className={styles["user-type-options-container"]}>
        <div
          onClick={() => setUserType("player")}
          className={
            userType === "player"
              ? styles["active-container"]
              : styles["user-type-container"]
          }
        >
          <h2 className={styles["user-type-title"]}>Oyuncu</h2>
        </div>
        <div
          onClick={() => setUserType("trainer")}
          className={
            userType === "trainer"
              ? styles["active-container"]
              : styles["user-type-container"]
          }
        >
          <h2 className={styles["user-type-title"]}>Eğitmen</h2>
        </div>
        <div
          onClick={() => setUserType("club")}
          className={
            userType === "club"
              ? styles["active-container"]
              : styles["user-type-container"]
          }
        >
          <h2 className={styles["user-type-title"]}>Kulüp</h2>
        </div>
      </div>
    </div>
  );
};

export default CommonRegisterNav;
