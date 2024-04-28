import React from "react";

import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../store/hooks";
import { useGetTrainerIncomingRequestsQuery } from "../../../../api/endpoints/BookingsApi";

interface TrainerRequestsNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
}

const TrainerRequestsNavigation = ({
  display,
  handleDisplay,
}: TrainerRequestsNavigationProps) => {
  const user = useAppSelector((store) => store?.user?.user?.user);

  const {
    data: incomingBookings,
    isLoading: isTrainerIncomingBookingsLoading,
  } = useGetTrainerIncomingRequestsQuery(user?.user_id);
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

export default TrainerRequestsNavigation;
