import React, { useState } from "react";

import styles from "./styles.module.scss";
import ClubStaffNavigation from "../../components/club-staff/navigation/ClubStaffNavigation";
import ClubStaffResults from "../../components/club-staff/staff-list/ClubStaffResults";
import ClubStaffRequests from "../../components/club-staff/requests/ClubStaffRequests";
import { useAppSelector } from "../../store/hooks";
import { useGetClubNewStaffRequestsQuery } from "../../api/endpoints/ClubStaffApi";

const ClubStaff = () => {
  const [display, setDisplay] = useState("staff");
  const handleDisplay = (value: string) => {
    setDisplay(value);
  };
  const user = useAppSelector((store) => store?.user?.user);

  const {
    data: myStaffRequests,
    isLoading: isMyStaffRequestsLoading,
    refetch: refetchMyStaffRequests,
  } = useGetClubNewStaffRequestsQuery(user?.clubDetails?.club_id);

  return (
    <div className={styles["club-staff-container"]}>
      <ClubStaffNavigation
        display={display}
        handleDisplay={handleDisplay}
        myStaffRequests={myStaffRequests}
      />
      {display === "staff" && <ClubStaffResults />}
      {display === "requests" && (
        <ClubStaffRequests
          myStaffRequests={myStaffRequests}
          refetchMyStaffRequests={refetchMyStaffRequests}
        />
      )}
    </div>
  );
};
export default ClubStaff;
