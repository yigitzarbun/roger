import React from "react";
import { NavLink } from "react-router-dom";
import paths from "../../../routing/Paths";
import styles from "./styles.module.scss";

const ClubHeader = () => {
  return (
    <nav className={styles["header-club-container"]}>
      <div className={styles["header-nav-sub-container"]}>
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
          to={paths.HOME}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-club"]}`
              : `${styles["nav-link-club"]}`
          }
        >
          Takvim
        </NavLink>
        <NavLink
          to={paths.HOME}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-club"]}`
              : `${styles["nav-link-club"]}`
          }
        >
          Personel
        </NavLink>
        <NavLink
          to={paths.HOME}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-club"]}`
              : `${styles["nav-link-club"]}`
          }
        >
          Üyeler
        </NavLink>
      </div>
    </nav>
  );
};
export default ClubHeader;