import React, { useEffect } from "react";

import { NavLink } from "react-router-dom";

import { FaCircle } from "react-icons/fa";

import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../store/hooks";

const ClubHeader = () => {
  const user = useAppSelector((store) => store?.user?.user);

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
          Personel
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
