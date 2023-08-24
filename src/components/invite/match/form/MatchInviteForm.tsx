import React, { useEffect } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import { useForm, SubmitHandler } from "react-hook-form";

import InviteModal from "../../modals/invite-modal/InviteModal";

import { useState } from "react";

import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetCourtsQuery } from "../../../../api/endpoints/CourtsApi";
import { useGetClubSubscriptionsQuery } from "../../../../api/endpoints/ClubSubscriptionsApi";

import { useAppSelector } from "../../../../store/hooks";

import { FormValues } from "../../modals/invite-modal/InviteModal";

import {
  useAddBookingMutation,
  useGetBookingsQuery,
} from "../../../../api/endpoints/BookingsApi";
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

const MatchInviteForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedPlayer = location.state;

  const { user } = useAppSelector((store) => store.user);

  const [addBooking, { isSuccess: isBookingSuccess }] = useAddBookingMutation(
    {}
  );

  const {
    data: bookings,
    isLoading: isBookingsLoading,
    refetch: refetchBookings,
  } = useGetBookingsQuery({});

  const [addPayment, { data: paymentData, isSuccess: isPaymentSuccess }] =
    useAddPaymentMutation({});

  const { refetch: refetchPayments } = useGetPaymentsQuery({});

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});

  const { data: clubSubscriptions, isLoading: isClubSubscriptionsLoading } =
    useGetClubSubscriptionsQuery({});

  const { data: players, isLoading: isPlayersLoading } = useGetPlayersQuery({});

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

  // payment method check
  const inviterPlayer = players?.find(
    (player) => player.user_id === user?.user?.user_id
  );
  let inviterPlayerPaymentMethodExists = false;

  if (
    inviterPlayer?.name_on_card &&
    inviterPlayer?.card_number &&
    inviterPlayer?.cvc &&
    inviterPlayer?.card_expiry
  ) {
    inviterPlayerPaymentMethodExists = true;
  }

  const inviteePlayer = players?.find(
    (player) => player.user_id === selectedPlayer?.user_id
  );
  let inviteePlayerPaymentMethodExists = false;

  if (
    inviteePlayer?.name_on_card &&
    inviteePlayer?.card_number &&
    inviteePlayer?.cvc &&
    inviteePlayer?.card_expiry
  ) {
    inviteePlayerPaymentMethodExists = true;
  }

  // subscription check
  let isPlayersSubscribed = false;
  let clubSubscriptionRequired = false;

  const selectedClubSubscriptions = clubSubscriptions?.filter(
    (subscription) => subscription.club_id === selectedClub
  );

  if (
    clubs?.find((club) => club.club_id === selectedClub)
      ?.is_player_subscription_required
  ) {
    clubSubscriptionRequired = true;
  }

  if (
    selectedPlayer &&
    user &&
    clubSubscriptions &&
    selectedClubSubscriptions &&
    clubSubscriptionRequired
  ) {
    if (
      selectedClubSubscriptions?.find(
        (subscription) =>
          subscription.player_id === selectedPlayer?.user_id &&
          subscription.is_active === true
      ) &&
      selectedClubSubscriptions?.find(
        (subscription) =>
          subscription.player_id === user?.user?.user_id &&
          subscription.is_active === true
      )
    )
      isPlayersSubscribed = true;
  }

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

        // Check if the startTime is not earlier than the current time
        if (
          startTime >= currentTime &&
          startTime !== "24:00" &&
          startTime !== "25:00"
        ) {
          const isBooked = bookedHoursForSelectedCourtOnSelectedDate.some(
            (booking) =>
              (startTime <= booking.event_time &&
                booking.event_time < endTime) ||
              (startTime < booking.end_time && booking.end_time <= endTime)
          );

          if (!isBooked) {
            availableTimeSlots.push({
              start: startTime,
              end: endTime,
            });
          }
        }

        startTime = roundToNearestHour(endTime);
      }
    } else {
      // If the selected date is in the future, show all time slots from opening to closing
      while (startTime < closingTime) {
        const endTime = addMinutes(startTime, slotDurationInMinutes);

        // Exclude the 24:00-25:00 time slot
        if (startTime !== "24:00" && startTime !== "25:00") {
          const isBooked = bookedHoursForSelectedCourtOnSelectedDate.some(
            (booking) =>
              (startTime <= booking.event_time &&
                booking.event_time < endTime) ||
              (startTime < booking.end_time && booking.end_time <= endTime)
          );

          if (!isBooked) {
            availableTimeSlots.push({
              start: startTime,
              end: endTime,
            });
          }
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
      event_type_id: 2,
      club_id: formData.club_id,
      court_id: formData.court_id,
      inviter_id: user?.user.user_id,
      invitee_id: selectedPlayer?.user_id,
      lesson_price: null,
      court_price: courts?.find((court) => court.court_id === selectedCourt)
        .price_hour,
      payment_id: null,
    };
    setBookingFormData(bookingData);
    setModal(true);
  };

  const handleModalSubmit = () => {
    setModal(false);

    if (inviterPlayerPaymentMethodExists && inviteePlayerPaymentMethodExists) {
      const paymentDetails = {
        payment_amount: bookingFormData?.court_price,
        court_price: bookingFormData?.court_price,
        payment_status: "pending",
        payment_type_id: 2,
        sender_inviter_id: user?.user.user_id,
        sender_invitee_id: selectedPlayer?.user_id,
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
  }, [isBookingSuccess, refetchBookings, navigate]);

  if (
    isBookingsLoading ||
    isClubsLoading ||
    isCourtsLoading ||
    isClubSubscriptionsLoading ||
    isPlayersLoading
  ) {
    return <div>Yükleniyor..</div>;
  }
  return (
    <div className={styles["invite-page-container"]}>
      <div className={styles["top-container"]}>
        <h1 className={styles["invite-title"]}>Maç Davet</h1>
        <Link to={paths.MATCH}>
          <img src="/images/icons/prev.png" className={styles["prev-button"]} />
        </Link>
      </div>
      <p
        className={styles["player-name"]}
      >{`Rakip: ${selectedPlayer?.fname} ${selectedPlayer?.lname}`}</p>
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
                <option key={club.club_id} value={club.club_id}>
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
                      court.club_id === selectedClub && court.is_active === true
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
          disabled={
            (clubSubscriptionRequired && !isPlayersSubscribed) ||
            !inviterPlayerPaymentMethodExists ||
            !inviteePlayerPaymentMethodExists
          }
        >
          {(!inviterPlayerPaymentMethodExists ||
            !inviteePlayerPaymentMethodExists) &&
            "Oyuncuların kort kiralamak için ödeme bilgilerini eklemesi gerekmektedir"}
          {clubSubscriptionRequired && !isPlayersSubscribed
            ? "Kort Kiralamak İçin Her İki Oyuncunun Da Kulüp Üyeliği Gerekmektedir"
            : "Davet Gönder"}
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

export default MatchInviteForm;
