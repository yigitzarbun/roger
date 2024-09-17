import React from "react";
import { BiTennisBall } from "react-icons/bi";
import styles from "./styles.module.scss";
const PageLoading = () => {
  return (
    <div className={styles["ball-container"]}>
      <BiTennisBall className={styles["tennis-ball"]} />
    </div>
  );
};

export default PageLoading;
