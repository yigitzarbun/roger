import React, { useState } from "react";

import styles from "./styles.module.scss";
import ClubStaffHero from "../../components/club-staff/hero/ClubStaffHero";
import ClubStaffNavigation from "../../components/club-staff/navigation/ClubStaffNavigation";
import ClubStaffResults from "../../components/club-staff/staff-list/ClubStaffResults";
import ClubStaffRequests from "../../components/club-staff/requests/ClubStaffRequests";

const ClubStaff = () => {
  const [display, setDisplay] = useState("staff");
  const handleDisplay = (value: string) => {
    setDisplay(value);
  };
  return (
    <div className={styles["club-staff-container"]}>
      <ClubStaffHero />
      <ClubStaffNavigation display={display} handleDisplay={handleDisplay} />
      {display === "staff" && <ClubStaffResults />}
      {display === "requests" && <ClubStaffRequests />}
    </div>
  );
};
export default ClubStaff;
