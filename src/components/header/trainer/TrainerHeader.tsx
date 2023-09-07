import React from "react";
import { NavLink } from "react-router-dom";
import paths from "../../../routing/Paths";
import styles from "./styles.module.scss";

const TrainerHeader = () => {
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
          Keşfet
        </NavLink>
        <NavLink
          to={paths.CALENDAR}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-trainer"]}`
              : `${styles["nav-link-trainer"]}`
          }
        >
          Takvim
        </NavLink>
        <NavLink
          to={paths.REQUESTS}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-trainer"]}`
              : `${styles["nav-link-trainer"]}`
          }
        >
          Davetler
        </NavLink>
        <NavLink
          to={paths.STUDENTS}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-trainer"]}`
              : `${styles["nav-link-trainer"]}`
          }
        >
          Öğrenciler
        </NavLink>
        <NavLink
          to={paths.PERFORMANCE}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-trainer"]}`
              : `${styles["nav-link-trainer"]}`
          }
        >
          Performans
        </NavLink>
      </div>
    </nav>
  );
};
export default TrainerHeader;
