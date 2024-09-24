import React from "react";
import { NavLink } from "react-router-dom";
import { FaCircle } from "react-icons/fa";
import paths from "../../../routing/Paths";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

interface ClubHeaderProps {
  myStaffRequests: any;
}
const ClubHeader = (props: ClubHeaderProps) => {
  const { myStaffRequests } = props;

  const { t } = useTranslation();

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
          {t("headerExploreTitle")}
        </NavLink>
        <NavLink
          to={paths.CLUB_COURTS}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-club"]}`
              : `${styles["nav-link-club"]}`
          }
        >
          {t("courtsTitle")}
        </NavLink>
        <NavLink
          to={paths.CALENDAR}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-club"]}`
              : `${styles["nav-link-club"]}`
          }
        >
          {t("headerCalendarTitle")}
        </NavLink>
        <NavLink
          to={paths.CLUB_STAFF}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-club"]}`
              : `${styles["nav-link-club"]}`
          }
        >
          {t("staff")}
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
          {t("subscriptions")}
        </NavLink>
        <NavLink
          to={paths.CLUB_TOURNAMENTS}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-club"]}`
              : `${styles["nav-link-club"]}`
          }
        >
          {t("headerTournamentsTitle")}
        </NavLink>
      </div>
    </nav>
  );
};
export default ClubHeader;
