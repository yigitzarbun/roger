import React from "react";
import { NavLink } from "react-router-dom";
import paths from "../../../routing/Paths";
import styles from "./styles.module.scss";

const PlayerHeader = () => {
  return (
    <nav className={styles["header-player-container"]}>
      <div className={styles["header-nav-sub-container"]}>
        <NavLink
          to={paths.EXPLORE}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-player"]}`
              : `${styles["nav-link-player"]}`
          }
        >
          Keşfet
        </NavLink>
        <NavLink
          to={paths.TRAIN}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-player"]}`
              : `${styles["nav-link-player"]}`
          }
        >
          Antreman
        </NavLink>
        <NavLink
          to={paths.MATCH}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-player"]}`
              : `${styles["nav-link-player"]}`
          }
        >
          Maç
        </NavLink>
        <NavLink
          to={paths.LESSON}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-player"]}`
              : `${styles["nav-link-player"]}`
          }
        >
          Ders
        </NavLink>
      </div>
      <div className={styles["header-nav-sub-container"]}>
        <NavLink
          to={paths.CALENDAR}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-player"]}`
              : `${styles["nav-link-player"]}`
          }
        >
          Takvim
        </NavLink>
        <NavLink
          to={paths.REQUESTS}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-player"]}`
              : `${styles["nav-link-player"]}`
          }
        >
          Davetler
        </NavLink>
        <NavLink
          to={paths.PERFORMANCE}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-player"]}`
              : `${styles["nav-link-player"]}`
          }
        >
          Performans
        </NavLink>
      </div>
    </nav>
  );
};
export default PlayerHeader;
