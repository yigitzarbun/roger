import React, { useEffect } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import styles from "./styles.module.scss";

import paths from "../../../../routing/Paths";

import { useForm, SubmitHandler } from "react-hook-form";

import InviteModal from "../../modals/invite-modal/InviteModal";

import { useState } from "react";

import { useGetClubsQuery } from "../../../../api/endpoints/ClubsApi";
import { useGetCourtsQuery } from "../../../../api/endpoints/CourtsApi";

import { useAppSelector } from "../../../../store/hooks";

import { FormValues } from "../../modals/invite-modal/InviteModal";
import {
  useAddBookingMutation,
  useGetBookingsQuery,
} from "../../../../api/endpoints/BookingsApi";

import { useGetClubSubscriptionsQuery } from "../../../../api/endpoints/ClubSubscriptionsApi";

import {
  addMinutes,
  formatTime,
  roundToNearestHour,
} from "../../../../common/util/TimeFunctions";

const TrainingInviteForm = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const player = location.state;

  const { user } = useAppSelector((store) => store.user);

  const [addBooking, { isSuccess }] = useAddBookingMutation({});

  const {
    data: bookings,
    isLoading: isBookingsLoading,
    refetch,
  } = useGetBookingsQuery({});

  const { data: clubs, isLoading: isClubsLoading } = useGetClubsQuery({});

  const { data: courts, isLoading: isCourtsLoading } = useGetCourtsQuery({});

  const { data: clubSubscriptions, isLoading: isClubSubscriptionsRequired } =
    useGetClubSubscriptionsQuery({});

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
    player &&
    user &&
    clubSubscriptions &&
    selectedClubSubscriptions &&
    clubSubscriptionRequired
  ) {
    if (
      selectedClubSubscriptions?.find(
        (subscription) =>
          subscription.player_id === player?.user_id &&
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
  const [formData, setFormData] = useState<FormValues | null>(null);

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    const bookingData = {
      event_date: new Date(formData.event_date).toISOString(),
      event_time: formData.event_time,
      // TO DO: get from api
      booking_status_type_id: 1,
      // TO DO: get from api
      event_type_id: 1,
      club_id: formData.club_id,
      court_id: formData.court_id,
      inviter_id: user?.user.user_id,
      invitee_id: player.user_id,
      lesson_price: null,
      court_price: courts?.find((court) => court.court_id === selectedCourt)
        .price_hour,
    };
    setFormData(bookingData);
    setModal(true);
  };

  const handleModalSubmit = () => {
    setModal(false);
    handleSubmit(() => {
      addBooking(formData);
      reset();
    })();
  };
  const handleCloseModal = () => {
    setModal(false);
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      navigate(paths.REQUESTS);
    }
  }, [isSuccess, refetch, navigate]);

  if (isBookingsLoading || isClubsLoading || isCourtsLoading) {
    return <div>Yükleniyor..</div>;
  }
  return (
    <div className={styles["invite-page-container"]}>
      <div className={styles["top-container"]}>
        <h1 className={styles["invite-title"]}>Antreman Davet</h1>
        <Link to={paths.TRAIN}>
          <img src="/images/icons/prev.png" className={styles["prev-button"]} />
        </Link>
      </div>
      <p
        className={styles["player-name"]}
      >{`Rakip: ${player.fname} ${player.lname}`}</p>
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
          disabled={clubSubscriptionRequired && !isPlayersSubscribed}
        >
          {clubSubscriptionRequired && !isPlayersSubscribed
            ? "Kort Kiralamak İçin Her İki Oyuncunun Da Kulüp Üyeliği Gerekmektedir"
            : "Davet Gönder"}
        </button>
      </form>
      <InviteModal
        modal={modal}
        handleModalSubmit={handleModalSubmit}
        formData={formData}
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
};

export default TrainingInviteForm;
