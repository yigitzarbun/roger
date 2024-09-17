import React, { useState } from "react";
import styles from "./styles.module.scss";
import {
  daysOfWeek,
  openHours,
  slotAvailabilityChecker,
} from "../../../../../../common/util/TimeFunctions";
import { useAppSelector } from "../../../../../../store/hooks";
import CourtBookingFormModal from "../../../../../../components/invite/court-booking/form/CourtBookingFormModal";
import { useTranslation } from "react-i18next";

interface ExploreCourtHoursSectionProps {
  bookings: any[];
  selectedCourt: any;
}
const ExploreCourtHoursSection = (props: ExploreCourtHoursSectionProps) => {
  const { bookings, selectedCourt } = props;

  const { t } = useTranslation();

  const user = useAppSelector((store) => store?.user?.user);

  const isUserClub = user?.user?.user_type_id === 3;

  const [isCourtBookingModalOpen, setIsCourtBookingModalOpen] = useState(false);

  const [eventDate, setEventDate] = useState("");

  const [eventTime, setEventTime] = useState("");

  const openCourtBookingInviteModal = (date: string, time: string) => {
    setEventDate(date);
    setEventTime(time);
    setIsCourtBookingModalOpen(true);
  };

  const closeCourtBookingInviteModal = () => {
    setEventDate("");
    setEventTime("");
    setIsCourtBookingModalOpen(false);
  };

  return (
    <div className={styles["courts-section"]}>
      <h2>{t("calendarTitle")}</h2>
      <table>
        <thead>
          <tr>
            <th>Saat</th>
            {daysOfWeek()?.map((day) => (
              <th key={day}>{day.split("-").reverse().join("-")}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {openHours(selectedCourt)?.map((hour) => (
            <tr key={hour} className={styles["court-row"]}>
              <td>{`${String(hour).slice(0, 2)}:${String(hour).slice(2)}`}</td>
              {daysOfWeek()?.map((day) => (
                <td key={day}>
                  {slotAvailabilityChecker(
                    day,
                    hour,
                    selectedCourt,
                    bookings
                  ) === "available" &&
                  selectedCourt?.[0]?.is_active === true ? (
                    <button
                      onClick={() => openCourtBookingInviteModal(day, hour)}
                      className={styles.available}
                      disabled={isUserClub}
                    >
                      {t("available")}
                    </button>
                  ) : (
                    <button className={styles.reserved}>{t("reserved")}</button>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <CourtBookingFormModal
        isCourtBookingModalOpen={isCourtBookingModalOpen}
        closeCourtBookingInviteModal={closeCourtBookingInviteModal}
        event_date={eventDate}
        event_time={eventTime}
        selectedCourt={selectedCourt}
      />
    </div>
  );
};
export default ExploreCourtHoursSection;
