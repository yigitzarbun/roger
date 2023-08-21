import React, { useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import { useForm, SubmitHandler } from "react-hook-form";

import InviteModal, { FormValues } from "../../modals/invite-modal/InviteModal";

import { useState } from "react";

import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";

import { useGetCourtsQuery } from "../../../../api/endpoints/CourtsApi";

import { useAppSelector } from "../../../../store/hooks";

import {
  useAddBookingMutation,
  useGetBookingsQuery,
} from "../../../../api/endpoints/BookingsApi";
import { useGetClubSubscriptionsQuery } from "../../../../api/endpoints/ClubSubscriptionsApi";
import { useGetClubStaffQuery } from "../../../../api/endpoints/ClubStaffApi";
import { useGetTrainersQuery } from "../../../../api/endpoints/TrainersApi";
import { useGetPlayersQuery } from "../../../../api/endpoints/PlayersApi";
import {
  useAddPaymentMutation,
  useGetPaymentsQuery,
} from "../../../../api/endpoints/PaymentsApi";

import {
  addMinutes,
  formatTime,
  roundToNearestHour,
} from "../../../../common/util/TimeFunctions";

const LeesonInviteForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: trainers, isLoading: isTrainersLoading } = useGetTrainersQuery(
    {}
  );
  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

  const user = useAppSelector((store) => store?.user?.user);

  const isUserTrainer = user?.user?.user_type_id === 2;
  const isUserPlayer = user?.user?.user_type_id === 1;

  let trainer;
  let player;
  let trainerUserId;
  let playerUserId;

  let trainerBankDetailsExist = false;
  let playerPaymentDetailsExist = false;

  if (user && isUserTrainer) {
    player = location.state;
    trainerUserId = user?.user?.user_id;
    playerUserId = player?.user_id;
    trainer = user;
  }

  if (user && isUserPlayer) {
    trainer = location.state;
    trainerUserId = trainer?.user_id;
    player = user;
    playerUserId = user?.user?.user_id;
  }

  const selectedTrainer = trainers?.find((t) => t.user_id === trainerUserId);
  const selectedPlayer = players?.find((p) => p.user_id === playerUserId);

  if (
    selectedTrainer?.iban &&
    selectedTrainer?.bank_id &&
    selectedTrainer?.name_on_bank_account
  ) {
    trainerBankDetailsExist = true;
  }

  if (
    selectedPlayer?.name_on_card &&
    selectedPlayer?.card_number &&
    selectedPlayer?.cvc &&
    selectedPlayer?.card_expiry
  ) {
    playerPaymentDetailsExist = true;
  }

  const navigateToPreviousPage = () => {
    navigate(-1);
  };

  const [addPayment, { data: paymentData, isSuccess: isPaymentSuccess }] =
    useAddPaymentMutation({});

  const { refetch: refetchPayments } = useGetPaymentsQuery({});

  const [addBooking, { isSuccess: isBookingSuccess }] = useAddBookingMutation(
    {}
  );

  const {
    data: bookings,
    isLoading: isBookingsLoading,
    refetch: refetchBookings,
  } = useGetBookingsQuery({});

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});

  const { data: clubSubscriptions, isLoading: isClubSubscriptionsLoading } =
    useGetClubSubscriptionsQuery({});

  const { data: clubStaff, isLoading: isClubStaffLoading } =
    useGetClubStaffQuery({});

  const today = new Date();
  let day = String(today.getDate());
  let month = String(today.getMonth() + 1);
  const year = today.getFullYear();

  day = String(day).length === 1 ? String(day).padStart(2, "0") : day;
  month = String(month).length === 1 ? String(month).padStart(2, "0") : month;

  const currentDay = `${year}-${month}-${day}`;

  const currentHour = String(today.getHours()).padStart(2, "0");
  const currentMinute = String(today.getMinutes()).padStart(2, "0");
  const currentTime = `${currentHour}:${currentMinute}`;

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
    setSelectedClub(Number(event.target.value));
  };

  const [selectedCourt, setSelectedCourt] = useState(null);
  const handleSelectedCourt = (event) => {
    setSelectedCourt(Number(event.target.value));
  };

  // subscription check
  let isPlayerSubscribed = false;
  let isTrainerStaff = false;

  let playerSubscriptionRequired = false;
  let trainerStaffRequired = false;

  const selectedClubSubscriptions = clubSubscriptions?.filter(
    (subscription) => subscription.club_id === selectedClub
  );

  // booking hours check
  const [bookedHoursForSelectedCourtOnSelectedDate, setBookedHours] = useState(
    []
  );
  useEffect(() => {
    if (selectedCourt && selectedDate && bookings) {
      const filteredBookings = bookings.filter(
        (booking) =>
          booking.court_id === Number(selectedCourt) &&
          booking.event_date.slice(0, 10) === selectedDate &&
          (booking.booking_status_type_id === 1 ||
            booking.booking_status_type_id === 2)
      );
      setBookedHours(filteredBookings);
    }
  }, [selectedCourt, selectedDate, bookings]);
  // Determine the available time slots based on the opening and closing times and the booked hours
  const availableTimeSlots = [];
  if (selectedCourt && selectedDate && courts) {
    const selectedCourtInfo = courts.find(
      (court) => court.court_id === selectedCourt
    );
    const openingTime = selectedCourtInfo.opening_time; // Make sure this is in "HH:mm" format
    const closingTime = selectedCourtInfo.closing_time; // Make sure this is in "HH:mm" format
    const slotDurationInMinutes = 60;

    // Loop through the time slots to create available time slots
    let startTime = roundToNearestHour(openingTime);

    // Check if the selected date is the same as the current date
    const currentDate = new Date();
    const selectedDateObj = new Date(selectedDate);
    const isCurrentDate =
      selectedDateObj.toDateString() === currentDate.toDateString();

    if (isCurrentDate) {
      // Find the next available time slot after the current hour
      while (startTime < closingTime) {
        const endTime = addMinutes(startTime, slotDurationInMinutes);
        const isBooked = bookedHoursForSelectedCourtOnSelectedDate.some(
          (booking) =>
            (startTime <= booking.event_time && booking.event_time < endTime) ||
            (startTime < booking.end_time && booking.end_time <= endTime)
        );

        if (!isBooked && startTime >= currentTime) {
          availableTimeSlots.push({
            start: startTime,
            end: endTime,
          });
        }

        startTime = roundToNearestHour(endTime);
      }
    } else {
      // If the selected date is in the future, show all time slots from opening to closing
      while (startTime < closingTime) {
        const endTime = addMinutes(startTime, slotDurationInMinutes);
        const isBooked = bookedHoursForSelectedCourtOnSelectedDate.some(
          (booking) =>
            (startTime <= booking.event_time && booking.event_time < endTime) ||
            (startTime < booking.end_time && booking.end_time <= endTime)
        );

        if (!isBooked) {
          availableTimeSlots.push({
            start: startTime,
            end: endTime,
          });
        }

        startTime = roundToNearestHour(endTime);
      }
    }
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const [modal, setModal] = useState(false);
  const [bookingFormData, setBookingFormData] = useState<FormValues | null>(
    null
  );

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    const bookingData = {
      event_date: new Date(formData.event_date).toISOString(),
      event_time: formData.event_time,
      booking_status_type_id: 1,
      event_type_id: 3,
      club_id: clubs?.find((club) => club.user_id === Number(formData.club_id))
        ?.club_id,
      court_id: formData.court_id,
      inviter_id: user?.user?.user_id,
      invitee_id: isUserTrainer
        ? playerUserId
        : isUserPlayer
        ? trainerUserId
        : null,
      lesson_price: trainers?.find(
        (trainer) => trainer.user_id === trainerUserId
      )?.price_hour,
      court_price: courts?.find((court) => court.court_id === selectedCourt)
        .price_hour,
      payment_id: null,
    };
    setBookingFormData(bookingData);
    setModal(true);
  };
  const handleModalSubmit = () => {
    setModal(false);

    if (playerPaymentDetailsExist && trainerBankDetailsExist) {
      const paymentDetails = {
        payment_amount:
          bookingFormData?.court_price +
          trainers?.find((trainer) => trainer.user_id === trainerUserId)
            ?.price_hour,
        court_price: bookingFormData?.court_price,
        lesson_price: trainers?.find(
          (trainer) => trainer.user_id === trainerUserId
        )?.price_hour,
        payment_status: "pending",
        payment_type_id: 3,
        sender_inviter_id: playerUserId,
        recipient_trainer_id: trainerUserId,
        recipient_club_id: clubs?.find(
          (club) => club.club_id === Number(bookingFormData?.club_id)
        )?.user_id,
      };
      addPayment(paymentDetails);
    }
  };

  const handleCloseModal = () => {
    setModal(false);
  };

  // disabled button

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState("");

  if (
    selectedClub &&
    clubs &&
    clubs?.find(
      (club) =>
        club.club_id ===
        clubs?.find((club) => club.user_id === selectedClub)?.club_id
    )?.is_player_lesson_subscription_required
  ) {
    playerSubscriptionRequired = true;
  }

  if (
    selectedClub &&
    clubs &&
    clubs?.find(
      (club) =>
        club.club_id ===
        clubs?.find((club) => club.user_id === selectedClub)?.club_id
    )?.is_trainer_subscription_required
  ) {
    trainerStaffRequired = true;
  }
  if (selectedClubSubscriptions?.length > 0 && user && clubSubscriptions) {
    if (
      selectedClubSubscriptions.find(
        (subscription) =>
          subscription.player_id === playerUserId &&
          subscription.is_active === true
      )
    ) {
      isPlayerSubscribed = true;
    }
  }
  if (
    selectedClubSubscriptions?.length > 0 &&
    trainer &&
    clubStaff &&
    clubSubscriptions &&
    selectedClub
  ) {
    if (
      clubStaff?.find(
        (staff) =>
          staff.user_id === trainerUserId &&
          staff.club_id ===
            clubs?.find((club) => club.user_id === selectedClub)?.club_id &&
          staff.employment_status === "accepted"
      )
    ) {
      isTrainerStaff = true;
    }
  }

  useEffect(() => {
    if (
      playerSubscriptionRequired === true &&
      trainerStaffRequired === true &&
      (isPlayerSubscribed === false || isTrainerStaff === false)
    ) {
      setIsButtonDisabled(true);
      setButtonText(
        "Kort kiralamak için oyuncunun kulübe üye, eğitmenin kulüp çalışanı olması gerekmektedir"
      );
    } else if (
      playerSubscriptionRequired === false &&
      trainerStaffRequired === true &&
      isTrainerStaff === false
    ) {
      setIsButtonDisabled(true);
      setButtonText(
        "Kort kiralamak için eğitmenin kulüp çalışanı olması gerekmektedir"
      );
    } else if (
      playerSubscriptionRequired === true &&
      trainerStaffRequired === false &&
      isPlayerSubscribed === false
    ) {
      setIsButtonDisabled(true);
      setButtonText(
        "Kort kiralamak için oyuncunun kulüp üyesi olması gerekmektedir"
      );
    } else if (!trainerBankDetailsExist || !playerPaymentDetailsExist) {
      setIsButtonDisabled(true);
      setButtonText(
        "Kort kiralamak için oyuncu ve eğitmenin banka bilgilerinin mevcut olması gerekmektedir"
      );
    }
  }, [selectedClub]);

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
      navigate(paths.REQUESTS);
    }
  }, [isBookingSuccess]);

  if (
    isBookingsLoading ||
    isClubStaffLoading ||
    isClubSubscriptionsLoading ||
    isClubsLoading ||
    isCourtsLoading ||
    isTrainersLoading ||
    isPlayersLoading
  ) {
    return <div>Yükleniyor..</div>;
  }
  return (
    <div className={styles["invite-page-container"]}>
      <div className={styles["top-container"]}>
        <h1 className={styles["invite-title"]}>Ders Davet</h1>
        <img
          src="/images/icons/prev.png"
          className={styles["prev-button"]}
          onClick={navigateToPreviousPage}
        />
      </div>
      {isUserPlayer && (
        <p
          className={styles["player-name"]}
        >{`Eğitmen: ${trainer?.fname} ${trainer?.lname}`}</p>
      )}
      {isUserTrainer && (
        <p
          className={styles["player-name"]}
        >{`Öğrenci: ${player?.fname} ${player?.lname}`}</p>
      )}
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
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
            )}
          </div>
          <div className={styles["input-container"]}>
            <label>Kulüp</label>
            <select
              {...register("club_id", { required: true })}
              onChange={handleSelectedClub}
            >
              <option value="">-- Seçim yapın --</option>
              {clubs?.map((club) => (
                <option key={club.user_id} value={club.user_id}>
                  {club.club_name}
                </option>
              ))}
            </select>
            {errors.club_id && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
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
                      court.club_id === clubs?.find((club) => club)?.club_id &&
                      court.is_active === true
                  )
                  .map((court) => (
                    <option key={court.court_id} value={court.court_id}>
                      {court.court_name}
                    </option>
                  ))}
            </select>
            {errors.court_id && (
              <span className={styles["error-field"]}>Bu alan zorunludur.</span>
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
        <button
          type="submit"
          className={styles["form-button"]}
          disabled={isButtonDisabled}
        >
          {isButtonDisabled ? buttonText : "Davet et"}
        </button>
      </form>
      <InviteModal
        modal={modal}
        handleModalSubmit={handleModalSubmit}
        formData={bookingFormData}
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
};

export default LeesonInviteForm;
