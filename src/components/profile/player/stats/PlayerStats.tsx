import React from "react";

import { Link } from "react-router-dom";

import PageLoading from "../../../../components/loading/PageLoading";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import { useAppSelector } from "../../../../store/hooks";

import { useGetBookingsQuery } from "../../../../api/endpoints/BookingsApi";

import { useGetStudentGroupsQuery } from "../../../../api/endpoints/StudentGroupsApi";

const PlayerStats = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: bookings, isLoading: isBookingsLoading } = useGetBookingsQuery(
    {}
  );

  const { data: studentGroups, isLoading: isStudentGroupsLoading } =
    useGetStudentGroupsQuery({});

  const myGroups = studentGroups?.filter(
    (group) =>
      group.is_active === true &&
      (group.first_student_id === user?.user?.user_id ||
        group.second_student_id === user?.user?.user_id ||
        group.third_student_id === user?.user?.user_id ||
        group.fourth_student_id === user?.user?.user_id)
  );

  const myEvents = bookings?.filter(
    (booking) =>
      (booking.inviter_id === user?.user?.user_id ||
        booking.invitee_id === user?.user?.user_id ||
        myGroups?.find((group) => group.user_id === booking.invitee_id)) &&
      booking.booking_status_type_id === 5
  );

  if (isBookingsLoading || isStudentGroupsLoading) {
    return <PageLoading />;
  }
  return (
    <div className={styles["player-stats-container"]}>
      <h2>Performans ve İstatistikler</h2>
      <div className={styles["stats-container"]}>
        <div className={styles.stat}>
          <p className={styles["stat-number"]}>
            {myEvents?.filter((event) => event.event_type_id === 1).length}
          </p>
          <p>Antreman</p>
        </div>
        <div className={styles.stat}>
          <p className={styles["stat-number"]}>
            {myEvents?.filter((event) => event.event_type_id === 2).length}
          </p>
          <p>Maç</p>
        </div>
        <div className={styles.stat}>
          <p className={styles["stat-number"]}>
            {myEvents?.filter((event) => event.event_type_id === 3).length}
          </p>
          <p>Özel ders</p>
        </div>
        <div className={styles.stat}>
          <p className={styles["stat-number"]}>
            {myEvents?.filter((event) => event.event_type_id === 6).length}
          </p>
          <p>Grup dersi</p>
        </div>
        <div className={styles.stat}>
          <p className={styles["stat-number"]}>{myEvents?.length}</p>
          <p>Toplam</p>
        </div>
      </div>
      <Link to={paths.PERFORMANCE} className={styles["view-all-button"]}>
        Tümünü Görüntüle
      </Link>
    </div>
  );
};

export default PlayerStats;
