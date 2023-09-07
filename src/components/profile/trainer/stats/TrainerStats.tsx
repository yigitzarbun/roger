import React from "react";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import { useAppSelector } from "../../../../store/hooks";

import { useGetBookingsQuery } from "../../../../api/endpoints/BookingsApi";
import { useGetStudentGroupsQuery } from "../../../../api/endpoints/StudentGroupsApi";

import PageLoading from "../../../../components/loading/PageLoading";

const TrainerStats = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: bookings, isLoading: isBookingsLoading } = useGetBookingsQuery(
    {}
  );

  const { data: groups, isLoading: isGroupsLoading } = useGetStudentGroupsQuery(
    {}
  );

  const myGroups = groups?.filter(
    (group) =>
      group.trainer_id === user?.user?.user_id && group.is_active === true
  );

  const myEvents = bookings?.filter(
    (booking) =>
      (booking.inviter_id === user?.user?.user_id ||
        booking.invitee_id === user?.user?.user_id ||
        booking.invitee_id ===
          myGroups?.find((group) => group.user_id === booking.invitee_id)
            ?.user_id) &&
      booking.booking_status_type_id === 5
  );
  if (isBookingsLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["trainer-stats-container"]}>
      <h2>Performans ve İstatistikler</h2>
      <div className={styles["stats-container"]}>
        <div className={styles.stat}>
          <p className={styles["stat-number"]}>
            {myEvents?.filter((event) => event.event_type_id === 3).length}
          </p>
          <p>Özel Ders</p>
        </div>

        <div className={styles.stat}>
          <p className={styles["stat-number"]}>
            {myEvents?.filter((event) => event.event_type_id === 6).length}
          </p>
          <p>Grup Dersi</p>
        </div>
        <div className={styles.stat}>
          <p className={styles["stat-number"]}>
            {myEvents?.filter((event) => event.event_type_id === 5).length}
          </p>
          <p>Kulüp Ders</p>
        </div>
        <div className={styles.stat}>
          <p className={styles["stat-number"]}>{myEvents?.length}</p>
          <p>Toplam</p>
        </div>
      </div>
      <Link to={paths.PERFORMANCE}>
        <button className={styles["view-all-button"]}>Tümünü Görüntüle</button>
      </Link>
    </div>
  );
};

export default TrainerStats;
