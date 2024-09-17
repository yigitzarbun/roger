import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { useAppSelector } from "../../../../store/hooks";
import { useGetPlayerIncomingRequestsQuery } from "../../../../../api/endpoints/BookingsApi";

interface PlayerRequestsNavigationProps {
  display: string;
  handleDisplay: (value: string) => void;
}

const PlayerRequestsNavigation = ({
  display,
  handleDisplay,
}: PlayerRequestsNavigationProps) => {
  const user = useAppSelector((store) => store?.user?.user);

  const { t } = useTranslation();

  const {
    data: incomingBookings,
    isLoading: isBookingsLoading,
    refetch: refetchBookings,
  } = useGetPlayerIncomingRequestsQuery(user?.user?.user_id);

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
        <span>{t("outgoingRequestsTitle")}</span>
      </button>
      <button
        onClick={() => handleDisplay("incoming")}
        className={
          display === "incoming"
            ? styles["active-button"]
            : styles["inactive-button"]
        }
      >
        <span>{t("incomingRequestsTitle")}</span>
        <span className={styles.notification}>
          {incomingBookings?.length > 0 && ` (${incomingBookings?.length})`}
        </span>
      </button>
    </div>
  );
};

export default PlayerRequestsNavigation;
