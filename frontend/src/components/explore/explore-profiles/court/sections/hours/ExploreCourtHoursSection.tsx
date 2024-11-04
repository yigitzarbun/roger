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
import EditTrainerBankDetails from "../../../../../../components/profile/trainer/bank-details/edit-bank-details/EditTrainerBankDetails";
import { useGetTrainerProfileDetailsQuery } from "../../../../../../../api/endpoints/TrainersApi";
import { useGetBanksQuery } from "../../../../../../../api/endpoints/BanksApi";

interface ExploreCourtHoursSectionProps {
  bookings: any[];
  selectedCourt: any;
}
const ExploreCourtHoursSection = (props: ExploreCourtHoursSectionProps) => {
  const { bookings, selectedCourt } = props;

  const { t } = useTranslation();

  const user = useAppSelector((store) => store?.user?.user);

  const isUserPlayer = user?.user?.user_type_id === 1;

  const isUserTrainer = user?.user?.user_type_id === 2;

  const isUserClub = user?.user?.user_type_id === 3;

  const [isCourtBookingModalOpen, setIsCourtBookingModalOpen] = useState(false);

  const [eventDate, setEventDate] = useState("");

  const [eventTime, setEventTime] = useState("");

  const { data: banks, isLoading: isBanksLoading } = useGetBanksQuery({});

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

  const [trainerBankDetailsModal, setTrainerBankDetailsModal] = useState(false);

  const handleOpenBankDetailsModal = () => {
    setTrainerBankDetailsModal(true);
  };

  const handleCloseBankDetailsModal = () => {
    setTrainerBankDetailsModal(false);
  };

  const {
    data: trainerDetails,
    isLoading: isTrainerDetailsLoading,
    refetch: refetchTrainerDetails,
  } = useGetTrainerProfileDetailsQuery(user?.user?.user_id);

  const bankDetailsExist =
    trainerDetails?.[0]?.trainerIban &&
    trainerDetails?.[0]?.trainerBankId &&
    trainerDetails?.[0]?.trainerBankAccountName;

  const openCourtBookingInviteModal = (date: string, time: string) => {
    if (
      (isUserPlayer && playerPaymentDetailsExist) ||
      (isUserTrainer && bankDetailsExist)
    ) {
      setEventDate(date);
      setEventTime(time);
      setIsCourtBookingModalOpen(true);
    } else if (isUserPlayer && !playerPaymentDetailsExist) {
      handleOpenCardDetailsModal();
    } else if (isUserTrainer && !bankDetailsExist) {
      handleOpenBankDetailsModal();
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
      {trainerBankDetailsModal && (
        <EditTrainerBankDetails
          isModalOpen={trainerBankDetailsModal}
          handleCloseModal={handleCloseBankDetailsModal}
          banks={banks}
          trainerDetails={trainerDetails?.[0]}
          bankDetailsExist={bankDetailsExist}
          refetchTrainerDetails={refetchTrainerDetails}
        />
      )}
    </div>
  );
};
export default ExploreCourtHoursSection;
