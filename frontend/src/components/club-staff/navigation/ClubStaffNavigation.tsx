import React from "react";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

interface ClubStaffNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
  myStaffRequests: any;
}

const ClubStaffNavigation = (props: ClubStaffNavigationProps) => {
  const { display, handleDisplay, myStaffRequests } = props;

  const { t } = useTranslation();

  return (
    <div className={styles["nav-container"]}>
      <button
        onClick={() => handleDisplay("staff")}
        className={
          display === "staff"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        {t("staff")}
      </button>
      <button
        onClick={() => handleDisplay("requests")}
        className={
          display === "requests"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        {t("applicationsTitle")}
        {myStaffRequests?.length > 0 && (
          <span
            className={styles.notification}
          >{` (${myStaffRequests?.length})`}</span>
        )}
      </button>
    </div>
  );
};

export default ClubStaffNavigation;
