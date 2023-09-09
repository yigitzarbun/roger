import React from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";
import { useGetClubStaffQuery } from "../../../api/endpoints/ClubStaffApi";
import PageLoading from "../../../components/loading/PageLoading";

interface ClubStaffNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
}

const ClubStaffNavigation = ({
  display,
  handleDisplay,
}: ClubStaffNavigationProps) => {
  const user = useAppSelector((store) => store?.user?.user);

  const {
    data: clubStaff,
    isLoading: isClubStaffLoading,
    refetch,
  } = useGetClubStaffQuery({});

  const myStaffRequests = clubStaff?.filter(
    (staff) =>
      staff.club_id === user?.clubDetails?.club_id &&
      staff.employment_status === "pending"
  );

  if (isClubStaffLoading) {
    return <PageLoading />;
  }

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
        Başvurular{" "}
        {myStaffRequests?.length > 0 && (
          <span className={styles.notification}>
            {" "}
            {myStaffRequests?.length}
          </span>
        )}
      </button>
    </div>
  );
};

export default ClubStaffNavigation;
