import React from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";
import { useGetBookingsQuery } from "../../../../api/endpoints/BookingsApi";

interface PlayerRequestsNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
}

const PlayerRequestsNavigation = ({
  display,
  handleDisplay,
}: PlayerRequestsNavigationProps) => {
  const user = useAppSelector((store) => store?.user?.user);
  const { data: bookings, isLoading: isBookingsLoading } = useGetBookingsQuery(
    {}
  );
  const date = new Date();
  const today = date.toLocaleDateString();
  const now = date.toLocaleTimeString();

  const incomingBookings = bookings?.filter(
    (booking) =>
      booking.invitee_id === user?.user?.user_id &&
      booking.booking_status_type_id === 1 &&
      (new Date(booking.event_date).toLocaleDateString() > today ||
        (new Date(booking.event_date).toLocaleDateString() === today &&
          booking.event_time >= now))
  );
  return (
    <div className={styles["nav-container"]}>
      <button
        onClick={() => handleDisplay("outgoing")}
        className={
          display === "outgoing"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        Gönderilen Davetler
      </button>
      <button
        onClick={() => handleDisplay("incoming")}
        className={
          display === "incoming"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        Gelen Davetler
        <span className={styles.notification}>
          {incomingBookings?.length > 0 && incomingBookings?.length}
        </span>
      </button>
    </div>
  );
};

export default PlayerRequestsNavigation;
