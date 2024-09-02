import React from "react";
import { useTranslation } from "react-i18next";
import { FaCircle } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import paths from "../../../routing/Paths";
import styles from "./styles.module.scss";

interface TrainerHeaderProps {
  trainerIncomingRequests: any;
  newStudentRequests: any;
}
const TrainerHeader = (props: TrainerHeaderProps) => {
  const { trainerIncomingRequests, newStudentRequests } = props;

  const { t } = useTranslation();

  return (
    <nav className={styles["header-trainer-container"]}>
      <div className={styles["header-nav-sub-container"]}>
        <NavLink
          to={paths.EXPLORE}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-trainer"]}`
              : `${styles["nav-link-trainer"]}`
          }
        >
          {t("headerExploreTitle")}
        </NavLink>
        <NavLink
          to={paths.CALENDAR}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-trainer"]}`
              : `${styles["nav-link-trainer"]}`
          }
        >
          {t("headerCalendarTitle")}
        </NavLink>
        <NavLink
          to={paths.REQUESTS}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-trainer"]}`
              : `${styles["nav-link-trainer"]}`
          }
        >
          {t("headerInvitesTitle")}

          {trainerIncomingRequests?.length > 0 && (
            <FaCircle className={styles["notification"]} />
          )}
        </NavLink>
        <NavLink
          to={paths.STUDENTS}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-trainer"]}`
              : `${styles["nav-link-trainer"]}`
          }
        >
          {t("trainerStudentsTitle")}
          {newStudentRequests?.length > 0 && (
            <FaCircle className={styles["notification"]} />
          )}
        </NavLink>
        <NavLink
          to={paths.PERFORMANCE}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-trainer"]}`
              : `${styles["nav-link-trainer"]}`
          }
        >
          {t("headerPerformanceTitle")}
        </NavLink>
      </div>
    </nav>
  );
};
export default TrainerHeader;
