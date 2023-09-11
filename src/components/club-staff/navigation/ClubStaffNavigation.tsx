import React, { useEffect } from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";
import {
  useGetClubStaffByFilterQuery,
  useGetClubStaffQuery,
} from "../../../api/endpoints/ClubStaffApi";
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

  const { data: clubStaffRequests, refetch: refetchClubStaffRequests } =
    useGetClubStaffQuery({});

  const {
    data: myStaffRequests,
    isLoading: isMyStaffRequestsLoading,
    refetch: refetchMyStaffRequests,
  } = useGetClubStaffByFilterQuery({
    club_id: user?.clubDetails?.club_id,
    employment_status: "pending",
  });

  useEffect(() => {
    refetchMyStaffRequests();
    refetchClubStaffRequests();
  }, [clubStaffRequests]);

  if (isMyStaffRequestsLoading) {
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
