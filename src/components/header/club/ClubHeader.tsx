import React, { useEffect } from "react";

import { NavLink } from "react-router-dom";

import { FaCircle } from "react-icons/fa";

import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";
import { useGetClubStaffByFilterQuery } from "../../../api/endpoints/ClubStaffApi";
import PageLoading from "../../../components/loading/PageLoading";

const ClubHeader = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const {
    data: myStaffRequests,
    isLoading: isMyStaffRequestsLoading,
    refetch: refetchMyRequests,
  } = useGetClubStaffByFilterQuery({
    club_id: user?.clubDetails?.club_id,
    employment_status: "pending",
  });

  useEffect(() => {
    refetchMyRequests();
  }, []);
  if (isMyStaffRequestsLoading) {
    return <PageLoading />;
  }

  return (
    <nav className={styles["header-club-container"]}>
      <div className={styles["header-nav-sub-container"]}>
        <NavLink
          to={paths.EXPLORE}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-club"]}`
              : `${styles["nav-link-club"]}`
          }
        >
          Keşfet
        </NavLink>
        <NavLink
          to={paths.CLUB_COURTS}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-club"]}`
              : `${styles["nav-link-club"]}`
          }
        >
          Kortlar
        </NavLink>
        <NavLink
          to={paths.CALENDAR}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-club"]}`
              : `${styles["nav-link-club"]}`
          }
        >
          Takvim
        </NavLink>
        <NavLink
          to={paths.CLUB_STAFF}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-club"]}`
              : `${styles["nav-link-club"]}`
          }
        >
          Personel{" "}
          {myStaffRequests?.length > 0 && (
            <FaCircle className={styles["notification"]} />
          )}
        </NavLink>
        <NavLink
          to={paths.CLUB_SUBSCRIPTIONS}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-club"]}`
              : `${styles["nav-link-club"]}`
          }
        >
          Üyelikler
        </NavLink>
      </div>
    </nav>
  );
};
export default ClubHeader;
