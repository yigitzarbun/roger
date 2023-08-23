import React from "react";

import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import { useAppSelector } from "../../../../store/hooks";

import { useGetBookingsQuery } from "../../../../api/endpoints/BookingsApi";

const TrainerStats = () => {
  const user = useAppSelector((store) => store?.user?.user);

  const { data: bookings, isLoading: isBookingsLoading } = useGetBookingsQuery(
    {}
  );

  const myEvents = bookings?.filter(
    (booking) =>
      (booking.inviter_id === user?.user?.user_id ||
        booking.invitee_id === user?.user?.user_id) &&
      booking.booking_status_type_id === 5
  );
  if (isBookingsLoading) {
    return <div>Yükleniyor..</div>;
  }
  return (
    <div className={styles["trainer-stats-container"]}>
      <h2>Performans ve İstatistikler</h2>
      <p>{`Özel ders sayısı: ${
        myEvents?.filter((event) => event.event_type_id === 3).length
      }`}</p>
      <Link to={paths.PERFORMANCE}>Tümünü Görüntüle</Link>
    </div>
  );
};

export default TrainerStats;
