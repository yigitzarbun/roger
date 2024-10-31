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
import AddPlayerCardDetails from "../../../../../../components/profile/player/card-payments/add-card-details/AddPlayerCardDetails";
import {
  useGetPlayerPaymentDetailsExistQuery,
  useGetPlayerProfileDetailsQuery,
} from "../../../../../../../api/endpoints/PlayersApi";

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

  const {
    data: playerPaymentDetailsExist,
    isLoading: isPlayerPaymentDetailsExistLoading,
  } = useGetPlayerPaymentDetailsExistQuery(user?.user?.user_id);

  const {
    data: playerDetails,
    isLoading: isPlayerDetailsLoading,
    refetch: refetchPlayerDetails,
  } = useGetPlayerProfileDetailsQuery(user?.user?.user_id);

  const [addPlayerCardDetailsModelOpen, setAddPlayerCardDetailsModelOpen] =
    useState(false);

  const handleOpenCardDetailsModal = () => {
    setAddPlayerCardDetailsModelOpen(true);
  };

  const handleCloseCardDetailsModal = () => {
    setAddPlayerCardDetailsModelOpen(false);
  };

  const openCourtBookingInviteModal = (date: string, time: string) => {
    if (playerPaymentDetailsExist) {
      setEventDate(date);
      setEventTime(time);
      setIsCourtBookingModalOpen(true);
    } else {
      handleOpenCardDetailsModal();
    }
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
      {isCourtBookingModalOpen && (
        <CourtBookingFormModal
          isCourtBookingModalOpen={isCourtBookingModalOpen}
          closeCourtBookingInviteModal={closeCourtBookingInviteModal}
          event_date={eventDate}
          event_time={eventTime}
          selectedCourt={selectedCourt}
        />
      )}
      {addPlayerCardDetailsModelOpen && (
        <AddPlayerCardDetails
          isModalOpen={addPlayerCardDetailsModelOpen}
          handleCloseModal={handleCloseCardDetailsModal}
          playerDetails={playerDetails}
          refetchPlayerDetails={refetchPlayerDetails}
          cardDetailsExist={playerPaymentDetailsExist}
        />
      )}
    </div>
  );
};
export default ExploreCourtHoursSection;
