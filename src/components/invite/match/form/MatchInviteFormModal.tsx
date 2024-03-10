import React, { useEffect } from "react";
import ReactModal from "react-modal";

import { useNavigate } from "react-router-dom";
import { localUrl } from "../../../../common/constants/apiConstants";

import { toast } from "react-toastify";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import { useForm, SubmitHandler } from "react-hook-form";

import { useState } from "react";

import {
  useGetClubByClubIdQuery,
  useGetClubsQuery,
} from "../../../../api/endpoints/ClubsApi";
import {
  useGetCourtByIdQuery,
  useGetCourtsQuery,
} from "../../../../api/endpoints/CourtsApi";
import { useGetPlayersTraininSubscriptionStatusQuery } from "../../../../api/endpoints/ClubSubscriptionsApi";

import { useAppSelector } from "../../../../store/hooks";

import {
  useAddBookingMutation,
  useGetBookedCourtHoursQuery,
  useGetPlayerOutgoingRequestsQuery,
} from "../../../../api/endpoints/BookingsApi";
import { useGetPlayerByUserIdQuery } from "../../../../api/endpoints/PlayersApi";
import {
  useAddPaymentMutation,
  useGetPaymentsQuery,
} from "../../../../api/endpoints/PaymentsApi";

import {
  formatTime,
  generateAvailableTimeSlots,
} from "../../../../common/util/TimeFunctions";

import PageLoading from "../../../loading/PageLoading";
import MatchInviteConfirmation from "../confirmation/MatchInviteConfirmation";

interface MatchInviteModalProps {
  opponentUserId: number;
  isInviteModalOpen: boolean;
  handleCloseInviteModal: () => void;
}

export type FormValues = {
  event_type_id: number;
  event_date: string;
  event_time: string;
  booking_status_type_id: number;
  club_id: number;
  court_id: number;
  court_price: number;
  lesson_price: number | null;
  invitee_id: number;
  inviter_id: number;
  payment_id: number;
  invitation_note?: string;
};

const MatchInviteFormModal = (props: MatchInviteModalProps) => {
  const { opponentUserId, isInviteModalOpen, handleCloseInviteModal } = props;

  const user = useAppSelector((store) => store?.user?.user);

  const navigate = useNavigate();

  const [confirmation, setConfirmation] = useState(false);
  const handleCloseConfirmation = () => {
    setConfirmation(false);
  };
  const { data: inviteePlayer, isLoading: isInviteePlayerLoading } =
    useGetPlayerByUserIdQuery(opponentUserId);

  const { data: inviterPlayer, isLoading: isInviterPlayerLoading } =
    useGetPlayerByUserIdQuery(user?.user?.user_id);

  const [addBooking, { isSuccess: isBookingSuccess }] = useAddBookingMutation(
    {}
  );

  const [addPayment, { data: paymentData, isSuccess: isPaymentSuccess }] =
    useAddPaymentMutation({});

  const { refetch: refetchPayments } = useGetPaymentsQuery({});

  const { refetch: refetchBookings } = useGetPlayerOutgoingRequestsQuery(
    user?.user?.user_id
  );

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});

  const today = new Date();
  let day = String(today.getDate());
  let month = String(today.getMonth() + 1);
  const year = today.getFullYear();

  day = String(day).length === 1 ? String(day).padStart(2, "0") : day;
  month = String(month).length === 1 ? String(month).padStart(2, "0") : month;

  const currentDay = `${year}-${month}-${day}`;

  const [selectedDate, setSelectedDate] = useState("");
  const handleSelectedDate = (event) => {
    setSelectedDate(event.target.value);
  };

  const [selectedTime, setSelectedTime] = useState("");
  const handleSelectedTime = (event) => {
    setSelectedTime(event.target.value);
  };
  const [selectedClub, setSelectedClub] = useState(null);
  const handleSelectedClub = (event) => {
    const newSelectedClub = Number(event.target.value);
    setSelectedClub(newSelectedClub);
    setValue("club_id", newSelectedClub);
  };

  const [selectedCourt, setSelectedCourt] = useState(null);
  const handleSelectedCourt = (event) => {
    setSelectedCourt(Number(event.target.value));
  };

  let inviterPlayerPaymentMethodExists = false;

  if (
    inviterPlayer?.[0]?.name_on_card &&
    inviterPlayer?.[0]?.card_number &&
    inviterPlayer?.[0]?.cvc &&
    inviterPlayer?.[0]?.card_expiry
  ) {
    inviterPlayerPaymentMethodExists = true;
  }

  let inviteePlayerPaymentMethodExists = false;
  if (
    inviteePlayer?.[0]?.name_on_card &&
    inviteePlayer?.[0]?.card_number &&
    inviteePlayer?.[0]?.cvc &&
    inviteePlayer?.[0]?.card_expiry
  ) {
    inviteePlayerPaymentMethodExists = true;
  }

  const [skipClubDetails, setSkipClubDetails] = useState(true);
  const { data: selectedClubDetails, isLoading: isSelectedClubDetailsLoading } =
    useGetClubByClubIdQuery(selectedClub, { skip: skipClubDetails });

  const [skipCourtDetails, setSkipCourtDetails] = useState(true);
  const {
    data: selectedCourtDetails,
    isLoading: isSelectedCourtDetailsLoading,
  } = useGetCourtByIdQuery(selectedCourt, { skip: skipCourtDetails });

  const [skipPlayersSubscribed, setSkipPlayersSubscribed] = useState(true);
  const { data: isPlayersSubscribed, isLoading: isPlayersSubscribedLoading } =
    useGetPlayersTraininSubscriptionStatusQuery(
      {
        inviterId: inviterPlayer?.[0]?.user_id,
        inviteeId: inviteePlayer?.[0]?.user_id,
        clubId: selectedClubDetails?.[0]?.user_id,
      },
      { skip: skipPlayersSubscribed }
    );

  // booking hours check
  const [bookedHoursForSelectedCourtOnSelectedDate, setBookedHours] = useState(
    []
  );
  const [skipBookedHours, setSkipBookedHours] = useState(true);
  const {
    data: bookedHours,
    isLoading: isBookedHourssLoading,
    refetch: refetchBookedHours,
  } = useGetBookedCourtHoursQuery(
    {
      courtId: selectedCourt,
      eventDate: selectedDate,
    },
    { skip: skipBookedHours }
  );

  let availableTimeSlots = generateAvailableTimeSlots(
    selectedCourt,
    selectedDate,
    courts,
    bookedHoursForSelectedCourtOnSelectedDate
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  const [bookingFormData, setBookingFormData] = useState<FormValues | null>(
    null
  );

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    if (
      (inviterPlayerPaymentMethodExists &&
        inviteePlayerPaymentMethodExists &&
        selectedClub &&
        selectedCourt &&
        selectedTime &&
        selectedDate &&
        !selectedClubDetails?.[0]?.is_player_subscription_required) ||
      (selectedClubDetails?.[0]?.is_player_subscription_required &&
        isPlayersSubscribed)
    ) {
      setConfirmation(true);
      const bookingData = {
        event_date: new Date(formData.event_date).toISOString(),
        event_time: formData.event_time,
        booking_status_type_id: 1,
        event_type_id: 2,
        club_id: formData.club_id,
        court_id: formData.court_id,
        inviter_id: user?.user.user_id,
        invitee_id: inviteePlayer?.[0]?.user_id,
        lesson_price: null,
        court_price:
          selectedClubDetails?.[0]?.higher_price_for_non_subscribers &&
          selectedCourtDetails?.[0]?.price_hour_non_subscriber &&
          !isPlayersSubscribed
            ? selectedCourtDetails?.[0]?.price_hour_non_subscriber
            : selectedCourtDetails?.[0]?.price_hour,
        payment_id: null,
        invitation_note: formData?.invitation_note
          ? formData?.invitation_note
          : "",
      };
      setBookingFormData(bookingData);
    } else if (
      !inviterPlayerPaymentMethodExists ||
      !inviteePlayerPaymentMethodExists
    ) {
      toast.error("Ödeme bilgileri eksik");
    } else if (
      selectedClubDetails?.[0]?.is_player_subscription_required &&
      !isPlayersSubscribed
    ) {
      toast.error(
        "Kort Kiralamak İçin Her İki Oyuncunun Da Kulüp Üyeliği Gerekmektedir"
      );
    }
  };

  const handleModalSubmit = () => {
    if (inviterPlayerPaymentMethodExists && inviteePlayerPaymentMethodExists) {
      const paymentDetails = {
        payment_amount: bookingFormData?.court_price,
        court_price: bookingFormData?.court_price,
        payment_status: "pending",
        payment_type_id: 2,
        sender_inviter_id: user?.user.user_id,
        sender_invitee_id: inviteePlayer?.[0]?.user_id,
        recipient_club_id: selectedClubDetails?.[0]?.user_id,
      };
      addPayment(paymentDetails);
    }
  };

  useEffect(() => {
    availableTimeSlots = generateAvailableTimeSlots(
      selectedCourt,
      selectedDate,
      courts,
      bookedHoursForSelectedCourtOnSelectedDate
    );
  }, [isInviteModalOpen]);

  useEffect(() => {
    if (bookedHours) {
      setBookedHours(bookedHours);
    } else {
      setBookedHours([]);
    }
  }, [bookedHours]);

  useEffect(() => {
    if (selectedCourt && selectedDate) {
      setSkipBookedHours(false);
    }
  }, [selectedCourt, selectedDate]);

  useEffect(() => {
    if (selectedClub) {
      setSkipClubDetails(false);
    } else {
      setSkipClubDetails(true);
    }
  }, [selectedClub]);

  useEffect(() => {
    if (selectedCourt) {
      setSkipCourtDetails(false);
    } else {
      setSkipCourtDetails(true);
    }
  }, [selectedCourt]);

  useEffect(() => {
    if (
      inviterPlayer?.length > 0 &&
      inviteePlayer?.length > 0 &&
      selectedClub?.length > 0
    ) {
      setSkipPlayersSubscribed(false);
    } else {
      setSkipPlayersSubscribed(true);
    }
  }, [selectedClubDetails]);

  useEffect(() => {
    if (isPaymentSuccess) {
      refetchPayments();
      bookingFormData.payment_id = paymentData?.payment_id;
      addBooking(bookingFormData);
      reset();
    }
  }, [isPaymentSuccess]);

  useEffect(() => {
    if (isBookingSuccess) {
      refetchBookings();
      refetchBookedHours();
      availableTimeSlots = generateAvailableTimeSlots(
        selectedCourt,
        selectedDate,
        courts,
        bookedHoursForSelectedCourtOnSelectedDate
      );
      toast.success("Başarıyla gönderildi");
      navigate(paths.REQUESTS);
    }
  }, [isBookingSuccess, refetchBookings, navigate]);

  if (
    isClubsLoading ||
    isCourtsLoading ||
    isInviteePlayerLoading ||
    isInviterPlayerLoading ||
    isSelectedClubDetailsLoading
  ) {
    return <PageLoading />;
  }
  return (
    <ReactModal
      isOpen={isInviteModalOpen}
      onRequestClose={handleCloseInviteModal}
      shouldCloseOnOverlayClick={false}
      className={styles["modal-container"]}
      overlayClassName={styles["modal-overlay"]}
    >
      <div className={styles["overlay"]} onClick={handleCloseInviteModal} />
      <div className={styles["modal-content"]}>
        <h3>Maç Davet</h3>
        <div className={styles["opponent-container"]}>
          <img
            src={
              inviteePlayer?.[0]?.image
                ? `${localUrl}/${inviteePlayer?.[0]?.image}`
                : "/images/icons/avatar.jpg"
            }
            className={styles["opponent-image"]}
          />
          <p
            className={styles["player-name"]}
          >{`${inviteePlayer?.[0].fname} ${inviteePlayer?.[0].lname}`}</p>
        </div>
        {confirmation ? (
          <MatchInviteConfirmation
            handleCloseConfirmation={handleCloseConfirmation}
            handleModalSubmit={handleModalSubmit}
            selectedClubName={selectedClubDetails?.[0]?.club_name}
            selectedCourtName={selectedCourtDetails?.[0]?.court_name}
            selectedCourtPrice={selectedCourtDetails?.[0]?.price_hour}
            selectedTime={selectedTime}
            selectedDate={selectedDate}
          />
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles["form-container"]}
          >
            <div className={styles["input-outer-container"]}>
              <div className={styles["input-container"]}>
                <label>Tarih</label>
                <input
                  {...register("event_date", {
                    required: "Bu alan zorunludur",
                  })}
                  type="date"
                  onChange={handleSelectedDate}
                  min={currentDay}
                />
                {errors.event_date && (
                  <span className={styles["error-field"]}>
                    Bu alan zorunludur.
                  </span>
                )}
              </div>
              <div className={styles["input-container"]}>
                <label>Kulüp</label>
                <select
                  {...register("club_id", { required: true })}
                  onChange={handleSelectedClub}
                >
                  <option value="">--Seçim yapın--</option>
                  {clubs?.map((club) => (
                    <option key={club.club_id} value={club.club_id}>
                      {club.club_name}
                    </option>
                  ))}
                </select>
                {errors.club_id && (
                  <span className={styles["error-field"]}>
                    Bu alan zorunludur.
                  </span>
                )}
              </div>
            </div>
            <div className={styles["input-outer-container"]}>
              <div className={styles["input-container"]}>
                <label>Kort</label>
                <select
                  {...register("court_id", { required: true })}
                  onChange={handleSelectedCourt}
                  disabled={!selectedClub || !selectedDate}
                >
                  <option value="">-- Seçim yapın --</option>
                  {selectedClub &&
                    courts
                      ?.filter(
                        (court) =>
                          court.club_id === selectedClub &&
                          court.is_active === true
                      )
                      .map((court) => (
                        <option key={court.court_id} value={court.court_id}>
                          {court.court_name}
                        </option>
                      ))}
                </select>
                {errors.court_id && (
                  <span className={styles["error-field"]}>
                    Bu alan zorunludur.
                  </span>
                )}
              </div>
              <div className={styles["input-container"]}>
                <label>Saat</label>
                <select
                  {...register("event_time", {
                    required: "Bu alan zorunludur",
                  })}
                  onChange={handleSelectedTime}
                  value={selectedTime}
                  disabled={!selectedClub || !selectedDate}
                >
                  <option value="">-- Seçim yapın --</option>
                  {availableTimeSlots.map((timeSlot) => (
                    <option key={timeSlot.start} value={timeSlot.start}>
                      {formatTime(timeSlot.start)} - {formatTime(timeSlot.end)}
                    </option>
                  ))}
                </select>
                {errors.event_time && (
                  <span className={styles["error-field"]}>
                    {errors.event_time.message}
                  </span>
                )}
              </div>
            </div>
            <div className={styles["message-container"]}>
              <label>Not</label>
              <textarea
                {...register("invitation_note")}
                placeholder="Karşı tarafa davetinizle ilgili eklemek istediğiniz not"
              />
            </div>
            <div className={styles["buttons-container"]}>
              <button
                onClick={handleCloseInviteModal}
                className={styles["discard-button"]}
              >
                İptal
              </button>
              <button type="submit" className={styles["submit-button"]}>
                Davet Gönder
              </button>
            </div>
            <p className={styles.invalid}>
              {(!inviterPlayerPaymentMethodExists ||
                !inviteePlayerPaymentMethodExists) &&
                "Kort kiralamak için her iki oyuncunun da ödeme bilgilerinin bulunması gerekmektedir."}
            </p>
            <p className={styles.invalid}>
              {selectedClubDetails?.[0]?.is_player_subscription_required &&
                !isPlayersSubscribed &&
                "Kort Kiralamak İçin Her İki Oyuncunun Da Kulüp Üyeliği Gerekmektedir"}
            </p>
          </form>
        )}
      </div>
    </ReactModal>
  );
};

export default MatchInviteFormModal;
