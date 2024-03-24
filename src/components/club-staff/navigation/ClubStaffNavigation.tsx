import React, { useEffect } from "react";

import styles from "./styles.module.scss";

import { useGetClubStaffQuery } from "../../../api/endpoints/ClubStaffApi";
import PageLoading from "../../../components/loading/PageLoading";

interface ClubStaffNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
  myStaffRequests: any;
}

const ClubStaffNavigation = (props: ClubStaffNavigationProps) => {
  const { display, handleDisplay, myStaffRequests } = props;
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
        Personel
      </button>
      <button
        onClick={() => handleDisplay("requests")}
        className={
          display === "requests"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        Başvurular
        {myStaffRequests?.length > 0 && (
          <span className={styles.notification}>{myStaffRequests?.length}</span>
        )}
      </button>
    </div>
  );
};

export default ClubStaffNavigation;
