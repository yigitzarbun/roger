import React, { useEffect } from "react";

import { FaCircle } from "react-icons/fa";

import { NavLink } from "react-router-dom";

import paths from "../../../routing/Paths";

import styles from "./styles.module.scss";

import PageLoading from "../../../components/loading/PageLoading";

import { useAppSelector } from "../../../store/hooks";
import { useGetPlayerIncomingRequestsQuery } from "../../../api/endpoints/BookingsApi";

const PlayerHeader = ({ navigateUser, handleCloseProfileModal }) => {
  const user = useAppSelector((store) => store?.user?.user);

  const {
    data: incomingBookings,
    isLoading: isBookingsLoading,
    refetch: refetchBookings,
  } = useGetPlayerIncomingRequestsQuery(user?.user?.user_id);

  useEffect(() => {
    refetchBookings();
  }),
    [];

  if (isBookingsLoading) {
    return <PageLoading />;
  }

  return (
    <nav
      className={styles["header-player-container"]}
      onClick={handleCloseProfileModal}
    >
      <div className={styles["header-nav-sub-container"]}>
        <NavLink
          to={paths.EXPLORE}
          onClick={() => navigateUser("EXPLORE")}
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
          onClick={() => navigateUser("TRAIN")}
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
          onClick={() => navigateUser("MATCH")}
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
          onClick={() => navigateUser("LESSON")}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-player"]}`
              : `${styles["nav-link-player"]}`
          }
        >
          Ders
        </NavLink>
        <NavLink
          to={paths.CALENDAR}
          onClick={() => navigateUser("CALENDAR")}
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
          onClick={() => navigateUser("REQUESTS")}
          className={({ isActive }) =>
            isActive
              ? `${styles["active-nav-link-player"]}`
              : `${styles["nav-link-player"]}`
          }
        >
          Davetler
          {incomingBookings?.length > 0 && (
            <FaCircle className={styles["notification"]} />
          )}
        </NavLink>
        <NavLink
          to={paths.PERFORMANCE}
          onClick={() => navigateUser("PERFORMANCE")}
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
